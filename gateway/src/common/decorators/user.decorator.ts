import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const currentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as Request

    return req.user
})