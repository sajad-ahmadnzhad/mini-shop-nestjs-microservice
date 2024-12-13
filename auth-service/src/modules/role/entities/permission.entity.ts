import { Action } from "../../../common/enums/action.enum";
import { Resource } from "../../../common/enums/resource.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity({ name: 'permissions' })
export class Permission {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: "enum", enum: Resource, nullable: false })
    resource: Resource

    @Column({ type: "jsonb", nullable: false })
    actions: Action[]

    @ManyToOne(() => Role, role => role.permissions, { onDelete: "CASCADE" })
    role: Role
}