import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DATABASE_CONFIG } from '@config/constants';

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {}

  getDatabaseConfig() {
    return this.configService.get<Record<string, string>>(DATABASE_CONFIG);
  }
}
