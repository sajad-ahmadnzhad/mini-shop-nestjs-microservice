import { Body, Controller, Get, HttpException, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { lastValueFrom } from "rxjs";
import { SignupDto } from "../dto/user.dto";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(@Inject('AUTH_SERVICE') private readonly authServiceClientProxy: ClientProxy) { }

    @Post('signup')
    @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
    async signup(@Body() signupDto: SignupDto) {
        const data = await lastValueFrom(this.authServiceClientProxy.send('signup', signupDto))

        if (data.error) {
            throw new HttpException(data.message, data.status)
        }

        return data
    }

}