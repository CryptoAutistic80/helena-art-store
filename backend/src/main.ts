import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import { DomainExceptionFilter } from './app/filters/domain-exception.filter';
import { CorrelationIdInterceptor } from './app/interceptors/correlation-id.interceptor';
import type { AppConfig } from '@helena-art-store/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(Logger);
  app.useLogger(logger);

  const config = app.get(ConfigService<AppConfig, true>);
  const frontend = config.get('frontend', { infer: true });
  const allowedOrigin = frontend?.url ?? true;

  app.enableCors({ origin: allowedOrigin, credentials: true });
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    }),
  );
  app.useGlobalFilters(new DomainExceptionFilter(logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalInterceptors(new CorrelationIdInterceptor(logger));
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });

  const port = config.get('http.port', { infer: true }) ?? 3000;
  await app.listen(port);
  logger.log(`Helena Art Store API listening on port ${port}`, 'Bootstrap');
}

bootstrap().catch((error) => {
  console.error('Unable to bootstrap the Helena Art Store API', error);
  process.exit(1);
});
