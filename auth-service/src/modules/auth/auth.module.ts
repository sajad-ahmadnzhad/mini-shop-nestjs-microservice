import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
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
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
