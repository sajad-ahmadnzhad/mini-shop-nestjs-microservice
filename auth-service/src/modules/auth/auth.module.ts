import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";
import envConfig from "../../configs/env.config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeormConfig } from "../../configs/typeorm.config";
import { CacheModule } from "@nestjs/cache-manager";
import cacheConfig from "../../configs/cache.config";
import { RoleModule } from "../role/role.module";
import { UsersModule } from "../users/users.module";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule.forRoot(envConfig()),
    CacheModule.registerAsync(cacheConfig()),
    TypeOrmModule.forRoot(typeormConfig()),
    JwtModule.register({
      global: true,
    }),
    RoleModule,
    UsersModule,
    ClientsModule.register({
      isGlobal: true,
      clients: [
        {
          name: "NOTIFICATION_SERVICE",
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: process.env.RABBITMQ_NOTIFICATION_SERVICE_QUEUE,
          },
        },
      ],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
