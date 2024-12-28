import { CanActivate, ExecutionContext, forwardRef, HttpException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Request } from "express";
import { ServiceResponse } from "../types/serviceResponse.type";
import { lastValueFrom } from "rxjs";
import { AuthController } from "../../modules/app/controllers/auth.controller";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject("AUTH_SERVICE") private readonly authServiceClientProxy: ClientProxy,
        @Inject(forwardRef(() => AuthController)) private readonly authController: AuthController
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest()

        const { authorization } = req.headers

        if (!authorization)
            throw new UnauthorizedException('authorization header is required')

        const [bearer, token] = authorization

        if (!bearer || bearer.toLowerCase() !== 'bearer')
            throw new UnauthorizedException('bearer token is invalid')

        if (!token)
            throw new UnauthorizedException('token is required')

        await this.authController.checkConnection()

        const verifyTokenRes: ServiceResponse = await lastValueFrom(this.authServiceClientProxy.send('verify-token', { token }))

        if (verifyTokenRes?.error)
            throw new HttpException(verifyTokenRes.message, verifyTokenRes.status)

        if (!verifyTokenRes?.data || (verifyTokenRes as any).data?.userId) {
            throw new UnauthorizedException('user account not found')
        }
        const userId = (verifyTokenRes as any).data?.userId
        const getUser: ServiceResponse = await lastValueFrom(this.authServiceClientProxy.send('get-one-user', { userId }))

        if (!getUser.error) {
            throw new HttpException(getUser.message, getUser.status)
        }

        if ((getUser as any).data.user) {
            throw new UnauthorizedException('user account not found')
        }

        req.user = (getUser as any).data?.user

        return true
    }
}