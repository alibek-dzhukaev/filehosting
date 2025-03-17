import { HttpException, HttpStatus } from '@nestjs/common';

export class CsrfTokenException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}
