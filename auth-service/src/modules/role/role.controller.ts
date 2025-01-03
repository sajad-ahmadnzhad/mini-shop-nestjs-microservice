import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';
import { MessagePattern } from '@nestjs/microservices';
import { IAccessPermission, IAssignRole, IGetOneRole, IRemoveRole, IRole, IUpdateRole } from './interfaces/role.interface';

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

  @MessagePattern('get-one-role')
  getOneRole(payload: IGetOneRole) {
    return this.roleService.findOne(payload)
  }

  @MessagePattern('update-role')
  updateRole(payload: IUpdateRole) {
    return this.roleService.update(payload)
  }

  @MessagePattern('remove-role')
  removeRole(payload: IRemoveRole) {
    return this.roleService.remove(payload);
  }

  @MessagePattern('access-permission')
  accessPermission(payload: IAccessPermission){
    return this.roleService.accessPermission(payload)
  }
}
