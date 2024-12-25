import { Injectable, NotFoundException } from "@nestjs/common";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ProductRepository extends Repository<Product> {
    constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {
        super(productRepository.target, productRepository.manager, productRepository.queryRunner)
    }

    createAndSave(args: Partial<Product>) {
        const product = this.create(args)

        return this.save(product)
    }

    async findOneAndThrow(args: FindOptionsWhere<Product>) {
        const product = await this.productRepository.findOneBy(args)

        if (!product) {
            throw new NotFoundException("product not found")
        }

        return product
    }

}