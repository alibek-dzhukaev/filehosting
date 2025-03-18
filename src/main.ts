import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppDataSource } from './data-source';
import { runMigrations } from '@common/database/migrations';
import { CsrfExceptionFilter } from '@common/csrf/filters/csrf-exception.filter';
import { ValidationExceptionFilter } from '@common/filters/validation-exception.filter';
import * as cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

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
    }),
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

bootstrap().catch(console.error);
