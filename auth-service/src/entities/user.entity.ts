import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", length: 500, nullable: false })
    full_name: string

    @Column({ type: "varchar", unique: true, nullable: false })
    username: string

    @Column({ type: "varchar", unique: true, nullable: false })
    email: string

    @Column({ type: "varchar", select: false, nullable: false })
    password: string

    @Column({ type: "bool", default: false })
    is_verify_email: boolean
}