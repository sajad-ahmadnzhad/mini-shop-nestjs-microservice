import { Controller, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiTags } from "@nestjs/swagger";

@Controller('order')
@ApiTags('order')
export class OrderController {
    constructor(@Inject('ORDER_SERVICE') private readonly orderServiceClientProxy: ClientProxy) { }



}