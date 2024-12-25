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

    @Column({ type: "int", nullable: false })
    creatorId: number

    @Column({ type: "timestamptz", nullable: false, default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @Column({ type: "timestamptz", nullable: false, default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date
}