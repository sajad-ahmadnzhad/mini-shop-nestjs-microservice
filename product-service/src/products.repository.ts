import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductRepository extends Repository<Product> {
    constructor(private readonly productRepository: Repository<Product>) {
        super(productRepository.target, productRepository.manager, productRepository.queryRunner)
    }

    createAndSave(args: Partial<Product>) {
        const product = this.create(args)

        return this.save(product)
    }

}