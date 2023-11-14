import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  app.useStaticAssets(join(__dirname, '..', 'images'), {
    prefix: '/images',
  });

  app.enableCors();

  const port = app.get(ConfigService).get<number>('PORT');
  await app.listen(port);
}
bootstrap();
