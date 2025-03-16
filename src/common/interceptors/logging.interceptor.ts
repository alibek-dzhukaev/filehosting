import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;

    // Log the incoming request
    this.logger.log(
      `Incoming Request: ${method} ${url} - Body: ${JSON.stringify(
        body,
      )} - Query: ${JSON.stringify(query)} - Params: ${JSON.stringify(params)}`,
    );

    const now = Date.now();
    return next.handle().pipe(
      tap((response) => {
        // Log the outgoing response
        this.logger.log(
          `Outgoing Response: ${method} ${url} - Status: ${
            context.switchToHttp().getResponse().statusCode
          } - Time: ${Date.now() - now}ms - Response: ${JSON.stringify(
            response,
          )}`,
        );
      }),
    );
  }
}