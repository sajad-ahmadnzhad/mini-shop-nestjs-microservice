import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Product } from "../entities/product.entity";

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
        entities: [Product],
        autoLoadEntities: false,
    };
};