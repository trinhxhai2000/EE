import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class History {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    result: number

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updateDate: Date
}