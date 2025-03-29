import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { NextFunction, Response, Request } from 'express';

import { CookieModule } from '@application/common/cookie/cookie.module';
import { CookieService } from '@application/common/cookie/services/cookie.service';
import { CsrfMiddleware } from '@application/common/csrf/middlewares/csrf.middleware';

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
