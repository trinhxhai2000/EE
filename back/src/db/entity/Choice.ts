import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Choice {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    questionId: number

    @Column()
    description: string

    @Column()
    isAnswer: boolean

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updateDate: Date
}