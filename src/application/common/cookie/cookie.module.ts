import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CookieService } from './services/cookie.service';

@Module({
  imports: [ConfigModule],
  providers: [CookieService],
  exports: [CookieService],
})
export class CookieModule {}
