import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @MessagePattern('create-role')
  create(payload) {

  }

}
