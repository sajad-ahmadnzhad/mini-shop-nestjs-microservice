import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';
import { MessagePattern } from '@nestjs/microservices';
import { IRole } from './interfaces/role.interface';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @MessagePattern('create-role')
  create(payload: IRole) {
   return this.roleService.create(payload)
  }

}
