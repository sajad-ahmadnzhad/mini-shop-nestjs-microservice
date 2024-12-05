import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

@Controller('service2')
@ApiTags('service2')
export class Service2Controller {
    constructor(@Inject("SERVICE2") private readonly service2ClientProxy: ClientProxy) { }

    @Get()
    getHello() {
        return lastValueFrom(this.service2ClientProxy.send('get-hello', {}))
    }
}
