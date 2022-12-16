import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Submission {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    recordId: number

    @Column()
    choiceId: number

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updateDate: Date
}