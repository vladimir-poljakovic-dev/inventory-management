import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const reflector = app.get(Reflector);

  // Strip unknown properties, reject extras, and transform payloads into DTO instances.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Authenticate first (JwtAuthGuard), then authorize (RolesGuard). Order matters.
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  // Wrap every successful response in { data, statusCode, timestamp }.
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Catch everything and return { error, statusCode, timestamp } without leaking stack traces.
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors({
    origin: config.get<string>('FRONTEND_URL'),
    credentials: true,
  });

  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
}

void bootstrap();
