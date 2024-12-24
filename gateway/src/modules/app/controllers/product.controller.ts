import { Controller, Get, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiTags } from "@nestjs/swagger";
import { lastValueFrom } from "rxjs";

@Controller('product')
@ApiTags('product')
export class ProductController {
    constructor(@Inject('PRODUCT_SERVICE') private readonly productServiceClientProxy: ClientProxy) { }

    @Get()
    getHello() {
        return lastValueFrom(this.productServiceClientProxy.send('get-hello', {}))
    }

}