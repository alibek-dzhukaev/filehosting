import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';

import { Observable, from } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor<T> implements NestInterceptor<T, T> {
  constructor(private readonly dataSource: DataSource) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    return from(queryRunner.connect()).pipe(
      switchMap(() => from(queryRunner.startTransaction())),
      switchMap(() => next.handle()),
      switchMap((result) =>
        from(
          (async () => {
            await queryRunner.commitTransaction();
            return result;
          })()
        )
      ),
      catchError((error) =>
        from(
          (async () => {
            await queryRunner.rollbackTransaction();
            throw error;
          })()
        )
      ),
      tap({
        next: () => from(queryRunner.release()),
        error: () => from(queryRunner.release()),
      })
    );
  }
}
