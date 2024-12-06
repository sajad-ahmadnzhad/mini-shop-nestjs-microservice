import { Controller, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiTags } from "@nestjs/swagger";

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
    constructor(@Inject('PAYMENT_SERVICE') private readonly paymentServiceClientProxy: ClientProxy) { }

    

}