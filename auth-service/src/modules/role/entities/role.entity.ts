import { Column, Entity } from "typeorm";

@Entity({ name: 'roles' })
export class Role {
    @Column({ type: "varchar", nullable: false, unique: true })
    name: string


    permissions: string[]
}
