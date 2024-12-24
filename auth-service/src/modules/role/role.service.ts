import { ConflictException, forwardRef, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IAssignRole, IGetOneRole, IRole } from './interfaces/role.interface';
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
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async create(payload: IRole) {
    try {
      const { name } = payload

      const existingRole = await this.roleRepository.findOneBy({ name })

      if (existingRole)
        throw new ConflictException("Role with this name already exists.")

      let role = this.roleRepository.create({ name })

      await this.roleRepository.save(role)

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

      const user = await this.userRepository.find

    } catch (error) {
      return sendError(error)
    }
  }

  async findOne(payload: IGetOneRole) {
    try {
      return await this.findOneAndThrow(payload);
    } catch (error) {
      return sendError(error);
    }
  }

  private async findOneAndThrow(args: FindOptionsWhere<Role>) {
    const existingRole = await this.roleRepository.findOneBy(args)

    if (!existingRole) {
      throw new NotFoundException('Role not found')
    }

    return existingRole
  }
}
