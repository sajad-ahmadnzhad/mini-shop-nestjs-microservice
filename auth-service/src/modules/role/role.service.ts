import { ConflictException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IAssignRole, IGetOneRole, IRole } from './interfaces/role.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { sendError } from '../../common/utils/functions.utils';
import { User } from '../auth/entities/user.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleRepository: RoleRepository
  ) { }

  async create(payload: IRole) {
    try {
      const { name } = payload

      const existingRole = await this.roleRepository.findOneBy({ name })

      if (existingRole)
        throw new ConflictException("Role with this name already exists.")

      await this.roleRepository.createAndSave({ name })

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

      // const role = await this.findOneAndThrow({ id: roleId })
      // 
      // const user = await this.userRepository.find

    } catch (error) {
      return sendError(error)
    }
  }

  async findOne(payload: IGetOneRole) {
    try {
      return await this.roleRepository.findOneById(payload.id);
    } catch (error) {
      return sendError(error);
    }
  }

}
