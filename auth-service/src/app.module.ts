import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import envConfig from './configs/env.config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './configs/typeorm.config';
import { User } from './entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import cacheConfig from './configs/cache.config';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig()),
    CacheModule.register(cacheConfig()),
    TypeOrmModule.forRoot(typeormConfig()),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
