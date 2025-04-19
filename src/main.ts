import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as CookieParser from 'cookie-parser';
import { join } from 'path';
import config from './config/config';

const appPort = config().port;
const apiPrefix = config().apiPrefix;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix(apiPrefix);
  app.enableCors({
    origin: config().env === 'production' ? undefined : 'http://localhost:3001',
    credentials: true,
  });
  app.use(CookieParser());
  app.useStaticAssets(join(__dirname, '..', 'client', 'dist'));

  await app.listen(appPort);
  console.info(`\nApplication is running on: http://localhost:${appPort}\n`);
}
bootstrap();
