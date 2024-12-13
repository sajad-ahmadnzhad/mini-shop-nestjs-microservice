import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission.entity";
import { User } from "../../../modules/app/entities/user.entity";

@Entity({ name: 'roles' })
export class Role {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: "varchar", nullable: false, unique: true })
    name: string

    @OneToMany(() => Permission, permission => permission.role)
    permissions: Permission[]

    @ManyToMany(() => User, user => user.roles, { onDelete: "CASCADE" })
    users: User[]
}