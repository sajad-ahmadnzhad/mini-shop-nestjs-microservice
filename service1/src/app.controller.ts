import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('service-1')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern('get-hello')
  getHello(dto: any) {
    console.log(dto)
    return this.appService.getHello();
  }
}
