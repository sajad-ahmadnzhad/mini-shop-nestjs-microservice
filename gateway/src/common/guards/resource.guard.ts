import { CanActivate, ExecutionContext, HttpException, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RESOURCE_KEY } from "../decorators/resource.decorator";
import { Resource } from '../../modules/app/enums/user.enum'
import { Request } from "express";
import { ACTION_KEY } from "../decorators/action.decorator";
import { ClientProxy } from "@nestjs/microservices";
import { ServiceResponse } from "../types/serviceResponse.type";
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class ResourceGuard implements CanActivate {
    constructor(
        @Inject("AUTH_SERVICE") private readonly authServiceClientProxy: ClientProxy,
        private readonly reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const resource = this.reflector.get<Resource[]>(RESOURCE_KEY, context.getHandler())
        const action = this.reflector.get(ACTION_KEY, context.getHandler())

        if (!resource || !action) return true

        const { user } = context.switchToHttp().getRequest() as Request

        const data: ServiceResponse = await lastValueFrom(this.authServiceClientProxy.send('access-permission', { user, resource, action }).pipe(timeout(5000)))

        if (data?.error) {
            throw new HttpException(data.message, data.status)
        }

        return !!(data as any)?.hasAccess
    }
}