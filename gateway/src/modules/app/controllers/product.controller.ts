import { Body, Controller, HttpException, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { lastValueFrom } from "rxjs";
import { ServiceResponse } from "src/common/types/serviceResponse.type";
import { CreateProductDto } from "../dto/product.dto";

@Controller('product')
@ApiTags('product')
export class ProductController {
    constructor(@Inject('PRODUCT_SERVICE') private readonly productServiceClientProxy: ClientProxy) { }

    @Post()
    @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
    async create(@Body() createProductDto: CreateProductDto) {
        const data: ServiceResponse = await lastValueFrom(this.productServiceClientProxy.send('create-product', { ...createProductDto, creatorId: 1 }))

        if (data.error) {
            throw new HttpException(data.message, data.status)
        }

        return data
    }

}