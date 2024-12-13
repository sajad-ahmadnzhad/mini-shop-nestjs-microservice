import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { IRole } from './interfaces/role.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { sendError } from '../../common/utils/functions.utils';
import { Permission } from './entities/permission.entity';

@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>
  ) { }

  async create(payload: IRole) {
    try {
      const { name, permissions } = payload

      const existingRole = await this.roleRepository.findOneBy({ name })

      if (existingRole)
        throw new ConflictException("Role with this name already exists.")

      let role = this.roleRepository.create({ name })

      role = await this.roleRepository.save(role)

      const permissionEntities = permissions.map(perm => {
        return this.permissionRepository.create({ ...perm, role })
      })

      await this.permissionRepository.save(permissionEntities)

      return {
        message: "Role created successfully",
        error: false,
        status: HttpStatus.CREATED,
        data: {}
      }
    } catch (error) {
      return sendError(error)
    }
  }

  async findOneAndThrow(args: FindOptionsWhere<Role>) {
    const existingRole = await this.roleRepository.findOneBy(args)

    if (!existingRole) {
      throw new NotFoundException('Role not found')
    }

    return existingRole
  }
}
