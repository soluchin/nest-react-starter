import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as CookieParser from 'cookie-parser';
import { join } from 'path';
import config from './config/config';
import { UserService } from './core/user/user.service';
import { JwtAuthGuard } from './core/auth/guards/passport-jwt.guard';
import { PermissionGuard } from './core/auth/guards/permission.guard';

const appPort = config().port;
const apiPrefix = config().apiPrefix;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  const reflector = new Reflector();
  const userService = app.get(UserService);

  app.setGlobalPrefix(apiPrefix);
  app.enableCors({
    origin: config().env === 'production' ? undefined : 'http://localhost:3001',
    credentials: true,
  });
  app.use(CookieParser());
  app.useStaticAssets(join(__dirname, '..', 'client', 'dist'));
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new PermissionGuard(reflector, userService),
  );

  await app.listen(appPort);
  console.info(`\nApplication is running on: http://localhost:${appPort}\n`);
}
bootstrap();
