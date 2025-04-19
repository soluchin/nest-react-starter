import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import config from "./config";

export const POSTGRES_CONFIG : TypeOrmModuleOptions = {
  type: 'postgres',
  
  host: config().database.host,
  port: config().database.port,
  database: config().database.name,
  username: config().database.username,
  password: config().database.password,

  autoLoadEntities: true,
  synchronize: true
}