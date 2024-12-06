import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(@Inject("ORDER_SERVICE") private readonly orderServiceClientProxy: ClientProxy) { }

  async getHello() {
    const data = await lastValueFrom(this.orderServiceClientProxy.send('get-hello', {}))
    return data
  }
}
