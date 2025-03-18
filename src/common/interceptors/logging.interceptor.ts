import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { Request, Response } from 'express'; // Import the Request type from Express
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request: Request = context.switchToHttp().getRequest();
    const { method, url } = request;

    const body = request.body as Record<string, unknown>;
    const query = request.query as Record<string, unknown>;
    const params = request.params as Record<string, unknown>;

    // Log the incoming request
    this.logger.log(
      `Incoming Request: ${method} ${url} - Body: ${JSON.stringify(
        body
      )} - Query: ${JSON.stringify(query)} - Params: ${JSON.stringify(params)}`
    );

    const now = Date.now();
    return next.handle().pipe(
      tap((response: unknown) => {
        const httpResponse: Response = context.switchToHttp().getResponse();

        // Log the outgoing response
        this.logger.log(
          `Outgoing Response: ${method} ${url} - Status: ${
            httpResponse.statusCode
          } - Time: ${Date.now() - now}ms - Response: ${JSON.stringify(response)}`
        );
      })
    );
  }
}
