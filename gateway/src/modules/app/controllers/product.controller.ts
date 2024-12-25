import { Body, Controller, Get, HttpException, Inject, InternalServerErrorException, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { lastValueFrom, timeout } from "rxjs";
import { ServiceResponse } from "src/common/types/serviceResponse.type";
import { CreateProductDto } from "../dto/product.dto";

@Controller('product')
@ApiTags('product')
export class ProductController {
    constructor(@Inject('PRODUCT_SERVICE') private readonly productServiceClientProxy: ClientProxy) { }

    checkConnection(): Promise<boolean> {
        try {
            return lastValueFrom(this.productServiceClientProxy.send('check-connection', {}).pipe(timeout(5000)))
        } catch (error) {
            throw new InternalServerErrorException("Product service is not connected")
        }
    }

    @Post()
    @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
    async create(@Body() createProductDto: CreateProductDto) {
        await this.checkConnection()

        const data: ServiceResponse = await lastValueFrom(this.productServiceClientProxy.send('create-product', { ...createProductDto, creatorId: 1 }).pipe(timeout(5000)))

        if (data.error) {
            throw new HttpException(data.message, data.status)
        }

        return data
    }


    @Get('/:id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        await this.checkConnection()

        const data: ServiceResponse = await lastValueFrom(this.productServiceClientProxy.send('get-one-product', { id }).pipe(timeout(5000)))

        if (data.error) {
            throw new HttpException(data.message, data.status)
        }

        return data
    }

    @Get()
    async getAll() {
        await this.checkConnection()

        const data: ServiceResponse = await lastValueFrom(this.productServiceClientProxy.send("get-products", {}).pipe(timeout(5000)))

        if (data.error) {
            throw new HttpException(data.message, data.status)
        }

        return data
    }

}