import { FindOptionsWhere, Repository } from "typeorm";
import { Role } from "./entities/role.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class RoleRepository extends Repository<Role> {
    constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {
        super(roleRepository.target, roleRepository.manager, roleRepository.queryRunner)
    }


    async findOneAndThrow(args: FindOptionsWhere<Role>) {
        const existingRole = await this.roleRepository.findOneBy(args)

        if (!existingRole) {
            throw new NotFoundException('Role not found')
        }

        return existingRole
    }

    findOneById(id: number) {
        return this.findOneAndThrow({ id })
    }

    createAndSave(role: Partial<Role>) {
        const createRole = this.create(role)

        return this.save(createRole)
    }

    async isNameTakenAndThrow(name: string, id: number) {
        const isNameTaken = await this.createQueryBuilder('role')
            .where('role.name = :name', { name })
            .andWhere('role.id != :id', { id })
            .getOne()

        if (isNameTaken) {
            throw new ConflictException('Role with this name already exists.')
        }

        return isNameTaken
    }

}