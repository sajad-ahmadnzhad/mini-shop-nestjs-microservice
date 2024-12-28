import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { ISignup } from './interfaces/signup.interface';
import { ISignin } from './interfaces/signin.interface';
import { IGoogleOauthUser } from './interfaces/googleOauth.interface';

@Controller()
export class AuthController {
  constructor(private readonly appService: AuthService) { }

  @MessagePattern('signup')
  signup(payload: ISignup) {
    return this.appService.signup(payload);
  }

  @MessagePattern('signin')
  signin(payload: ISignin) {
    return this.appService.signin(payload)
  }

  @MessagePattern('refreshToken')
  refreshToken({ refreshToken }: { refreshToken: string }) {
    return this.appService.refreshToken(refreshToken)
  }

  @MessagePattern('signout')
  signout({ refreshToken }: { refreshToken: string }) {
    return this.appService.signout(refreshToken)
  }

  @MessagePattern('googleRedirect')
  googleRedirect(user: IGoogleOauthUser | undefined) {
    return this.appService.googleRedirect(user)
  }

  @MessagePattern("verify-token")
  verifyToken(payload: { token: string }) {
    return this.appService.verifyToken(payload?.token)
  }

  @MessagePattern('checkConnection')
  checkConnection() {
    return true
  }

}
