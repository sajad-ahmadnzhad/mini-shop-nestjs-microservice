import { CanActivate, ExecutionContext, forwardRef, HttpException, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RESOURCES_KEY } from "../decorators/resource.decorator";
import { Resource } from '../../modules/app/enums/user.enum'
import { Request } from "express";
import { ACTIONS_KEY } from "../decorators/action.decorator";
import { ClientProxy } from "@nestjs/microservices";
import { AuthController } from "../../modules/app/controllers/auth.controller";
import { ServiceResponse } from "../types/serviceResponse.type";
import { lastValueFrom } from "rxjs";

@Injectable()
export class ResourceGuard implements CanActivate {
    constructor(
        @Inject("AUTH_SERVICE") private readonly authServiceClientProxy: ClientProxy,
        @Inject(forwardRef(() => AuthController)) private readonly authController: AuthController,
        private readonly reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const resources = this.reflector.get<Resource[]>(RESOURCES_KEY, context.getHandler())
        const actions = this.reflector.get(ACTIONS_KEY, context.getHandler())

        if (!resources || !actions) return true

        const { user } = context.switchToHttp().getRequest() as Request

        await this.authController.checkConnection()

        const data: ServiceResponse = await lastValueFrom(this.authServiceClientProxy.send('access-permission', { user, resources, actions }))

        if (data?.error) {
            throw new HttpException(data.message, data.status)
        }

        return true
    }
}