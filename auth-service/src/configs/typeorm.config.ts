import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "../modules/app/entities/user.entity";
import { Permission } from "../modules/role/entities/permission.entity";
import { Role } from "../modules/role/entities/role.entity";

export const typeormConfig = (): TypeOrmModuleOptions => {
  const {
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_SYNCHRONIZE,
  } = process.env;

  return {
    type: "postgres",
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: !!Number(DB_SYNCHRONIZE),
    entities: [User, Permission, Role],
    autoLoadEntities: false,
  };
};