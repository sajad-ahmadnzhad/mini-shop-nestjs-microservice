import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import * as path from "path";
import { RedisModule } from "@nestjs-modules/ioredis";
import redisConfig from "../configs/redis.config";
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.join(process.cwd(), "/.env"),
      isGlobal: true
    }),
    RedisModule.forRoot(redisConfig())
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
