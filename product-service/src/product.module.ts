import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeormConfig } from './configs/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import envConfig from './configs/env.config';
import { CacheModule } from '@nestjs/cache-manager';
import cacheConfig from './configs/cache.config';
@Module({
  imports: [
    ConfigModule.forRoot(envConfig()),
    TypeOrmModule.forRoot(typeormConfig()),
    CacheModule.register(cacheConfig())
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule { }
