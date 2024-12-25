import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { MessagePattern } from '@nestjs/microservices';
import { ICreateProduct } from './interfaces/create-products.interface';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @MessagePattern('check-connection')
  checkConnection() {
    return true
  }

  @MessagePattern('create-product')
  create(payload: ICreateProduct) {
    return this.productService.create(payload);
  }

  @MessagePattern('get-one-product')
  getOne(payload: { id: number }) {
    return this.productService.getOne(payload)
  }
}
