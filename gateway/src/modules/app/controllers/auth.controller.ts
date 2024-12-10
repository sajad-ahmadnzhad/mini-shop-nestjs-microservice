import { Body, Controller, Get, HttpException, Inject, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { lastValueFrom } from "rxjs";
import { RefreshTokenDto, SigninDto, SignupDto } from "../dto/user.dto";
import { ServiceResponse } from "../../../common/types/serviceResponse.type";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(@Inject('AUTH_SERVICE') private readonly authServiceClientProxy: ClientProxy) { }

    @Post('signup')
    @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
    async signup(@Body() signupDto: SignupDto) {
        const data: ServiceResponse = await lastValueFrom(this.authServiceClientProxy.send('signup', signupDto))

        if (data.error) {
            throw new HttpException(data.message, data.status)
        }

        return data
    }

    @Post('signin')
    @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
    async signin(@Body() signinDto: SigninDto) {
        const data: ServiceResponse = await lastValueFrom(this.authServiceClientProxy.send('signin', signinDto))

        if (data.error) {
            throw new HttpException(data.message, data.status)
        }

        return data
    }

    @Post('refresh-token')
    @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
    async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
        const data: ServiceResponse = await lastValueFrom(this.authServiceClientProxy.send('refreshToken', refreshToken))

        if (data.error) {
            throw new HttpException(data.message, data.status)
        }

        return data
    }

    @Get('google/login')
    @UseGuards(AuthGuard('google'))
    googleOauth() { }


    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleRedirect(@Req() req: Request) {
        const { user } = req

        const data: ServiceResponse = await lastValueFrom(this.authServiceClientProxy.send('googleRedirect', user))

        if (data.error) {
            throw new HttpException(data.message, data.status)
        }

        return data
    }

}