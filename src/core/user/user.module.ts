import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/core/user.entity';
import { Role } from 'src/entities/core/role.entity';
import { Permission } from 'src/entities/core/permission.entity';
import { UserController } from './user.controller';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
