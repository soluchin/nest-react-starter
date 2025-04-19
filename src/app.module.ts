import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { UserModule } from './core/user/user.module';
import { EntitiesModule } from './entities/entities.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'dist'),
      exclude: ['/api*'],
    }),

    // CORE MODULES
    EntitiesModule,
    AuthModule, 
    UserModule, 

    // ADD MORE MODULE HERE
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
