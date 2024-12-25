import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "products" })
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", nullable: false, length: 100 })
    title: string

    @Column({ type: "text", nullable: false })
    description: string

    @Column({ type: "int", nullable: false })
    count: number

    @Column({ type: "int", nullable: false, unique: true })
    creatorId: number

    @Column({ type: "timestamptz", default: () => new Date() })
    createdAt: Date

    @Column({ type: "timestamptz", default: () => new Date() })
    updatedAt: Date
}