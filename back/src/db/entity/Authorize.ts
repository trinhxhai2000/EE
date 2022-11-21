import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Authorize {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    table: string

    @Column()
    permission: string

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}