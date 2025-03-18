import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { CsrfMiddleware } from './middlewares/csrf.middleware';

@Module({})
export class CsrfModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CsrfMiddleware).forRoutes('*');
  }
}
