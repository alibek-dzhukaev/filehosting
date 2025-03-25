import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { NextFunction, Request, Response } from 'express';

import { CookieModule } from '@common/cookie/cookie.module';
import { CookieService } from '@common/cookie/services/cookie.service';

import { CsrfMiddleware } from './middlewares/csrf.middleware';

@Module({
  imports: [ConfigModule, CookieModule],
})
export class CsrfModule implements NestModule {
  constructor(
    private readonly configService: ConfigService,
    private readonly cookieService: CookieService
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((request: Request, response: Response, next: NextFunction) => {
        new CsrfMiddleware(this.configService, this.cookieService).use(request, response, next);
      })
      .forRoutes('*');
  }
}
