import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AppModule } from './app.module';

function getCorsOrigins(): string[] {
  return (
    process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://localhost:8081'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: getCorsOrigins()
  });

  const config = new DocumentBuilder()
    .setTitle('Wellness Package API')
    .setDescription('Admin and mobile APIs for wellness package management.')
    .setVersion('0.1.0')
    .build();
  const document = cleanupOpenApiDoc(SwaggerModule.createDocument(app, config));
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
}

void bootstrap();
