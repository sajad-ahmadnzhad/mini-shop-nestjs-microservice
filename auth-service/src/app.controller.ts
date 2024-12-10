import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { ISignup } from './interfaces/signup.interface';
import { ISignin } from './interfaces/signin.interface';
import { IGoogleOauthUser } from './interfaces/googleOauth.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern('signup')
  signup(dto: ISignup) {
    return this.appService.signup(dto);
  }

  @MessagePattern('signin')
  signin(dto: ISignin) {
    return this.appService.signin(dto)
  }

  @MessagePattern('refreshToken')
  refreshToken(refreshToken: string) {
    return this.appService.refreshToken(refreshToken)
  }

  @MessagePattern('googleRedirect')
  googleRedirect(user: IGoogleOauthUser | undefined) {
    return this.appService.googleRedirect(user)
  }

}
