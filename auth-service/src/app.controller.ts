import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { ISignup } from './interfaces/signup.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern('signup')
  signup(dto: ISignup) {
    return this.appService.signup(dto);
  }
}
