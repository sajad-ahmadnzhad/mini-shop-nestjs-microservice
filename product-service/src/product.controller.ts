import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { ClientGrpcProxy, MessagePattern } from '@nestjs/microservices';
import { ICreateProduct } from './interfaces/create-product.interface';
import { IRemoveProduct } from './interfaces/remove-product.interface';

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

  @MessagePattern('get-products')
  getAll() {
    return this.productService.getAll()
  }

  @MessagePattern('remove-product')
  remove(payload: IRemoveProduct) {
    return this.productService.remove(payload)
  }

  @MessagePattern('update-product')
  update(payload: IRemoveProduct) {
    return this.productService.update(payload)
  }
}
