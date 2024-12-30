import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { lastValueFrom, timeout } from "rxjs";
import {
  AssignRoleDto,
  CreateRoleDto,
  RefreshTokenDto,
  SigninDto,
  SignoutDto,
  SignupDto,
  UpdateRoleDto,
} from "../dto/user.dto";
import { ServiceResponse } from "../../../common/types/serviceResponse.type";
import { AuthGuard as PassportAuthGuard } from "@nestjs/passport";
import { AuthGuard } from "../../../common/guards/auth.guard";
import {
  Resource as ResourceEnum,
  Action as ActionEnum,
} from "../enums/user.enum";
import { Request } from "express";
import { ResourceGuard } from "../../../common/guards/resource.guard";
import { Action } from "../../../common/decorators/action.decorator";
import { Resource } from "../../../common/decorators/resource.decorator";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(
    @Inject("AUTH_SERVICE") private readonly authServiceClientProxy: ClientProxy
  ) {}

  async checkConnection() {
    try {
      await lastValueFrom(
        this.authServiceClientProxy
          .send("checkConnection", {})
          .pipe(timeout(5000))
      );
    } catch (error) {
      throw new InternalServerErrorException("auth service is not connected");
    }
  }

  @Post("signup")
  @ApiConsumes("application/json", "application/x-www-form-urlencoded")
  async signup(@Body() signupDto: SignupDto) {
    await this.checkConnection();

    const data: ServiceResponse = await lastValueFrom(
      this.authServiceClientProxy.send("signup", signupDto).pipe(timeout(5000))
    );

    if (data.error) {
      throw new HttpException(data.message, data.status);
    }

    return data;
  }

  @Post("signin")
  @ApiConsumes("application/json", "application/x-www-form-urlencoded")
  async signin(@Body() signinDto: SigninDto) {
    await this.checkConnection();

    const data: ServiceResponse = await lastValueFrom(
      this.authServiceClientProxy.send("signin", signinDto).pipe(timeout(5000))
    );

    if (data.error) {
      throw new HttpException(data.message, data.status);
    }

    return data;
  }

  @Post("signout")
  @ApiConsumes("application/json", "application/x-www-form-urlencoded")
  async signout(@Body() signoutDto: SignoutDto) {
    await this.checkConnection();

    const data: ServiceResponse = await lastValueFrom(
      this.authServiceClientProxy
        .send("signout", signoutDto)
        .pipe(timeout(5000))
    );

    if (data.error) {
      throw new HttpException(data.message, data.status);
    }

    return data;
  }

  @Post("refresh-token")
  @ApiConsumes("application/json", "application/x-www-form-urlencoded")
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    await this.checkConnection();

    const data: ServiceResponse = await lastValueFrom(
      this.authServiceClientProxy
        .send("refreshToken", refreshToken)
        .pipe(timeout(5000))
    );

    if (data.error) {
      throw new HttpException(data.message, data.status);
    }

    return data;
  }

  @Get("google/login")
  @UseGuards(PassportAuthGuard("google"))
  googleOauth() {}

  @Get("google/redirect")
  @UseGuards(PassportAuthGuard("google"))
  async googleRedirect(@Req() req: Request) {
    const { user } = req;

    await this.checkConnection();

    const data: ServiceResponse = await lastValueFrom(
      this.authServiceClientProxy
        .send("googleRedirect", user)
        .pipe(timeout(5000))
    );

    if (data.error) {
      throw new HttpException(data.message, data.status);
    }

    return data;
  }

  @Post("role")
  @ApiConsumes("application/json", "application/x-www-form-urlencoded")
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    await this.checkConnection();

    const data: ServiceResponse = await lastValueFrom(
      this.authServiceClientProxy
        .send("create-role", createRoleDto)
        .pipe(timeout(5000))
    );

    if (data.error) {
      throw new HttpException(data.message, data.status);
    }

    return data;
  }

  @Get("role/:id")
  async getOneUser(@Param("id", ParseIntPipe) id: number) {
    await this.checkConnection();

    const data: ServiceResponse = await lastValueFrom(
      this.authServiceClientProxy.send("get-one-role", { id })
    );

    if (data.error) {
      throw new HttpException(data.message, data.status);
    }

    return data;
  }

  @Put("role/:id")
  @ApiConsumes("application/json", "application/x-www-form-urlencoded")
  async updateRole(
    @Param("id", ParseIntPipe) id: number,
    @Body() roleDto: UpdateRoleDto
  ) {
    await this.checkConnection();

    const data: ServiceResponse = await lastValueFrom(
      this.authServiceClientProxy.send("update-role", { id, ...roleDto })
    );

    if (data.error) {
      throw new HttpException(data.message, data.status);
    }

    return data;
  }

  @Delete("role/:id")
  @UseGuards(AuthGuard, ResourceGuard)
  @Resource(ResourceEnum.ROLES)
  @Action(ActionEnum.DELETE)
  async removeRole(@Param("id", ParseIntPipe) id: number) {
    await this.checkConnection();

    const data: ServiceResponse = await lastValueFrom(
      this.authServiceClientProxy.send("remove-role", { id })
    );

    if (data.error) {
      throw new HttpException(data.message, data.status);
    }

    return data;
  }

  @Put("assign-role")
  async assignRoleToUser(@Body() assignRoleDto: AssignRoleDto) {
    await this.checkConnection();

    const data: ServiceResponse = await lastValueFrom(
      this.authServiceClientProxy.send("assign-role", assignRoleDto)
    );

    if (data.error) throw new HttpException(data.message, data.status);

    return data;
  }
}
