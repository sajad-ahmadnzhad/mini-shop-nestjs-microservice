import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from './products.repository';
import { ICreateProduct } from './interfaces/create-product.interface';
import { sendError } from './common/utils/sendError.utils';
import { IRemoveProduct } from './interfaces/remove-product.interface';
import { IUpdateProduct } from './interfaces/update-product.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisCache } from 'cache-manager-redis-yet';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    @Inject(CACHE_MANAGER) private readonly redisCache: RedisCache
  ) { }

  async create(payload: ICreateProduct) {
    try {
      const product = await this.productRepository.createAndSave(payload)

      return {
        message: "Product created successfully",
        status: HttpStatus.CREATED,
        error: false,
        data: { product }
      }
    } catch (error) {
      return sendError(error)
    }
  }

  async getOne(payload: { id: number }) {
    try {
      const product = await this.productRepository.findOneAndThrow(payload)

      return {
        message: "",
        error: false,
        status: HttpStatus.OK,
        data: { product }
      }
    } catch (error) {
      return sendError(error)
    }
  }

  async getAll() {
    try {
      const redisKey = 'get_products'

      let products = await this.redisCache.get<Product[] | undefined>(redisKey)

      if (!products) {
        products = await this.productRepository.find()
      }

      await this.redisCache.set(redisKey, products, 30_000)

      return {
        message: "",
        error: false,
        status: HttpStatus.OK,
        data: { products }
      }
    } catch (error) {
      return sendError(error)
    }
  }

  async remove(payload: IRemoveProduct) {
    try {
      await this.productRepository.findOneAndThrow(payload)

      await this.productRepository.delete(payload)

      return {
        message: "Product removed successfully",
        error: false,
        status: HttpStatus.OK,
        data: {}
      }
    } catch (error) {
      return sendError(error)
    }
  }

  async update(payload: IUpdateProduct) {
    try {
      const { count, creatorId, description, id, title } = payload
      const product = await this.productRepository.findOneAndThrow({ id, creatorId })

      await this.productRepository.update({ id: product.id }, { count, description, title })

      return {
        message: "Product updated successfully",
        error: false,
        status: HttpStatus.OK,
        data: {}
      }
    } catch (error) {
      return sendError(error)
    }
  }
}
