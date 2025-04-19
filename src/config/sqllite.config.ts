import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const SQLITE_CONFIG: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: 'sqlite.db',

    autoLoadEntities: true,
    synchronize: true
};