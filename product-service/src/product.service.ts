import { HttpStatus, Injectable } from '@nestjs/common';
import { ProductRepository } from './products.repository';
import { ICreateProduct } from './interfaces/create-products.interface';
import { sendError } from './common/utils/sendError.utils';
import { IRemoveProduct } from './interfaces/remove-product.interface';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) { }

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
      const products = await this.productRepository.find()

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
}
