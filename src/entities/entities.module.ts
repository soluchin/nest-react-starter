import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config/config';
import { POSTGRES_CONFIG } from 'src/config/postgres.config';
import { SQLITE_CONFIG } from 'src/config/sqllite.config';
import { User } from './core/user.entity';
import { Role } from './core/role.entity';
import { Permission } from './core/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(config().env === 'production' ? POSTGRES_CONFIG : SQLITE_CONFIG),

    // CORE ENTITIES
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission
    ]),

    // Add MORE ENTITIES HERE
  ]
})
export class EntitiesModule {}
