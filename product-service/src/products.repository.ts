import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
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

}