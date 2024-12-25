import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeormConfig } from './configs/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import envConfig from './configs/env.config';
import { CacheModule } from '@nestjs/cache-manager';
import cacheConfig from './configs/cache.config';
import { Product } from './entities/product.entity';
import { ProductRepository } from './products.repository';
@Module({
  imports: [
    ConfigModule.forRoot(envConfig()),
    TypeOrmModule.forRoot(typeormConfig()),
    CacheModule.register(cacheConfig()),
    TypeOrmModule.forFeature([Product])
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule { }
