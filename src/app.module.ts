import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerModuleOptions, ThrottlerGuard } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as redisStore from 'cache-manager-redis-store';

import { BullMQModule } from '@application/bullmq/bullmq.module';
import { DatabaseService } from '@application/database/database.service';
import { RedisCacheService } from '@application/redis/redisCache.service';
import { SseModule } from '@application/sse/sse.module';

import configuration from '@config/configuration';
import { validationSchema } from '@config/validation.schema';

import { KafkaModule } from '@infrastructure/messaging/kafka.module';
import { StorageModule } from '@infrastructure/storage/storage.module';

import { AuthModule } from '@resources/auth/auth.module';
import { ChannelsModule } from '@resources/channels/channels.module';
import { HealthModule } from '@resources/health/health.module';
import { MessagesModule } from '@resources/messages/messages.module';
import { UsersModule } from '@resources/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [configuration],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsRun: false,
        cli: {
          migrationsDir: 'src/migrations',
        },
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: configService.getOrThrow<number>('THROTTLER_TTL'),
            limit: configService.getOrThrow<number>('THROTTLER_LIMIT'),
          },
        ],
      }),
    }),
    // CsrfModule,
    SseModule,
    BullMQModule,
    KafkaModule,
    StorageModule,
    AuthModule,
    UsersModule,
    ChannelsModule,
    MessagesModule,
    HealthModule,
  ],
  providers: [
    DatabaseService,
    RedisCacheService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
