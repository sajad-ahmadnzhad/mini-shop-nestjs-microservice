import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  IAccessPermission,
  IAssignRole,
  IGetOneRole,
  IRemoveRole,
  IRole,
  IUpdateRole,
} from "./interfaces/role.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { sendError } from "../../common/utils/functions.utils";
import { User } from "../auth/entities/user.entity";
import { RoleRepository } from "./role.repository";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleRepository: RoleRepository
  ) {}

  async create(payload: IRole) {
    try {
      const { name } = payload;

      const existingRole = await this.roleRepository.findOneBy({ name });

      if (existingRole)
        throw new ConflictException("Role with this name already exists.");

      await this.roleRepository.createAndSave({ name });

      return {
        message: "Role created successfully",
        error: false,
        status: HttpStatus.CREATED,
        data: {},
      };
    } catch (error) {
      return sendError(error);
    }
  }

  async assignRoleToUser(payload: IAssignRole) {
    try {
      const { roleId, userId } = payload;

      const role = await this.roleRepository.findOneAndThrow({ id: roleId });
      const user = await this.userRepository.findOneBy({});

      return {
        message: "Assigned role success",
        error: false,
        status: HttpStatus.OK,
        data: {},
      };
    } catch (error) {
      return sendError(error);
    }
  }

  async findOne(payload: IGetOneRole) {
    try {
      const role = await this.roleRepository.findOneById(payload.id);

      return {
        message: "",
        error: false,
        status: HttpStatus.OK,
        data: { ...role },
      };
    } catch (error) {
      return sendError(error);
    }
  }

  async update(payload: IUpdateRole) {
    try {
      await this.roleRepository.findOneAndThrow({ id: payload.id });

      await this.roleRepository.isNameTakenAndThrow(payload.name, payload.id);

      await this.roleRepository.update(
        { id: payload.id },
        { name: payload.name }
      );

      return {
        message: "updated role successfully",
        error: false,
        status: HttpStatus.OK,
        data: {},
      };
    } catch (error) {
      return sendError(error);
    }
  }

  async remove(payload: IRemoveRole) {
    try {
      await this.roleRepository.findOneAndThrow({ id: payload.id });

      await this.roleRepository.delete({ id: payload.id });

      return {
        message: "Role removed successfully",
        error: false,
        status: HttpStatus.OK,
        data: {},
      };
    } catch (error) {
      return sendError(error);
    }
  }

  async accessPermission(payload: IAccessPermission) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: payload.user?.id },
        relations: { roles: { permissions: true } },
      });

      if (!user) throw new NotFoundException("User not found");

      const { resource, action } = payload;

      const hasAccess = user.roles.some((role) =>
        role.permissions.some(
          (perm) => perm.resource === resource && perm.actions.includes(action)
        )
      );

      return {
        message: "",
        error: false,
        status: HttpStatus.OK,
        data: { hasAccess },
      };
    } catch (error) {
      return sendError(error);
    }
  }
}
