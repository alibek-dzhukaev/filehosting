import { Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CookieModule } from '@common/cookie/cookie.module';

@Module({
  imports: [ConfigModule, CookieModule],
})
export class CsrfModule implements NestModule {
  constructor() {}

  configure() {
    // consumer: MiddlewareConsumer
    // consumer
    //   .apply((request: Request, response: Response, next: NextFunction) => {
    //     new CsrfMiddleware(this.configService, this.cookieService).use(request, response, next);
    //   })
    //   .forRoutes('*');
  }
}
