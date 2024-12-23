import { ConflictException, forwardRef, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IAssignRole, IRole } from './interfaces/role.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { sendError } from '../../common/utils/functions.utils';
import { Permission } from './entities/permission.entity';
import { User } from '../auth/entities/user.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService
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

  async assignRoleToUser(payload: IAssignRole) {
    try {
      const { roleId, userId } = payload

      const role = await this.findOneAndThrow({ id: roleId })

      const user = await this.authService

    } catch (error) {
      sendError(error)
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
