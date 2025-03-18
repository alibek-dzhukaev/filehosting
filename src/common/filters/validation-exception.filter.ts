import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';

import { Response } from 'express';

import { ValidationErrorResponse } from '../types/validation-error.response';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status: HttpStatus = exception.getStatus();

    if (status === HttpStatus.BAD_REQUEST) {
      const validationResponse = exception.getResponse();

      const formattedErrors = this.formatValidationErrors(validationResponse);

      const errorResponse: ValidationErrorResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        errors: formattedErrors,
      };

      response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
    } else {
      response.status(status).json({
        statusCode: status,
        message: exception.message,
      });
    }
  }

  private formatValidationErrors(
    validationResponse: string | object
  ): { field: string; messages: string[] }[] {
    if (typeof validationResponse === 'string') {
      // Handle string responses (e.g., "Bad Request")
      return [{ field: 'general', messages: [validationResponse] }];
    }

    if (Array.isArray(validationResponse['message'])) {
      // Handle array of validation messages
      return validationResponse['message'].map((message: string) => ({
        field: 'general',
        messages: [message],
      }));
    }

    if (typeof validationResponse['message'] === 'string') {
      // Handle single validation message
      return [{ field: 'general', messages: [validationResponse['message']] }];
    }

    // Handle other cases (e.g., nested validation errors)
    return [];
  }
}
