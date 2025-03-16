import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CsrfTokenException } from '../exceptions/csrf-token.exception';

@Catch(CsrfTokenException)
export class CsrfExceptionFilter implements ExceptionFilter {
  catch(exception: CsrfTokenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(HttpStatus.FORBIDDEN).json({
      statusCode: HttpStatus.FORBIDDEN,
      message: 'Invalid CSRF token',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
