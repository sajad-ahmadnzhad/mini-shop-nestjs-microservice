import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import envConfig from '../../configs/env.config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from '../../configs/typeorm.config';
import { CacheModule } from '@nestjs/cache-manager';
import cacheConfig from '../../configs/cache.config';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig()),
    CacheModule.registerAsync(cacheConfig()),
    TypeOrmModule.forRoot(typeormConfig()),
    JwtModule.register({
      global: true,
    }),
    RoleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
