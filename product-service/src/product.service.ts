import { HttpStatus, Injectable } from '@nestjs/common';
import { ProductRepository } from './products.repository';
import { ICreateProduct } from './interfaces/create-products.interface';
import { sendError } from './common/utils/sendError.utils';

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
}
