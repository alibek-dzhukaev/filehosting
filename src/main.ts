import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as Sentry from '@sentry/node';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { CsrfExceptionFilter } from '@application/common/csrf/filters/csrf-exception.filter';
import { HttpExceptionFilter } from '@application/common/filters/http-exception.filter';
import { ValidationExceptionFilter } from '@application/common/filters/validation-exception.filter';
import { LoggingInterceptor } from '@application/common/interceptors/logging.interceptor';
import { runMigrations } from '@application/database/migrations';

import { AppModule } from './app.module';
import { AppDataSource } from './data-source';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('NODE_PORT', 3000);

  if (configService.get('RUN_MIGRATIONS') === '1') {
    await runMigrations(AppDataSource);
  }

  Sentry.init({
    dsn: configService.getOrThrow<string>('SENTRY_DSN'),
    environment: configService.getOrThrow<string>('NODE_ENV'),
    tracesSampleRate: 1.0,
  });

  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', '*'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(helmet());
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.setGlobalPrefix(configService.get('GLOBAL_PREFIX', ''));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new CsrfExceptionFilter());
  app.useGlobalFilters(new ValidationExceptionFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API documentation for NestJS application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, () => {
    console.log('\x1b[34m', `Application is running on localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.log(error);
  process.exit(1);
});
