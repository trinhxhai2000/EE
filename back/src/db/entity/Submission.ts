import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Submission {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    historyId: number

    @Column()
    choiceId: number

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updateDate: Date
}