import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

@Controller('service1')
@ApiTags('service1')
export class Service1Controller {
    constructor(@Inject("SERVICE1") private readonly service1ClientProxy: ClientProxy) { }

    @Get()
    getHello() {
        return lastValueFrom(this.service1ClientProxy.send('get-hello', {}))
    }
}
