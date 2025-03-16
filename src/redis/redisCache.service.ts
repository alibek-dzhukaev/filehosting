import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  async setKey(key: string, value: string): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async getKey(key: string): Promise<string | null> {
    return await this.cacheManager.get(key);
  }
}