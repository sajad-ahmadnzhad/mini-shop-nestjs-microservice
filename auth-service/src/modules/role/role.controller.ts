import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';
import { MessagePattern } from '@nestjs/microservices';
import { IAssignRole, IRole } from './interfaces/role.interface';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @MessagePattern('create-role')
  create(payload: IRole) {
    return this.roleService.create(payload)
  }

  @MessagePattern('assign-role')
  assignRoleToUser(payload: IAssignRole) {
    return this.roleService.assignRoleToUser(payload)
  }

}