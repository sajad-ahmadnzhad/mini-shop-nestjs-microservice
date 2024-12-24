import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @MessagePattern('get-hello')
  getHello(): string {
    return this.productService.getHello();
  }
}
