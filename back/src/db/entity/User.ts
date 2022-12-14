import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from "typeorm"
import { ValidatorResult } from "./Validator"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    username: string

    @Column()
    role: string

    @Column()
    hashPassword: string

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date
}

export enum ROLES {
    USER = 'user',
    ADMIN = 'admin',
}

export class UserValidator {
    public static validate(user: User): ValidatorResult {
        const result = {
            success: false,
            message: "",
        }
        if (user.username.length < 5) {
            result.message = 'Username should have at least 5 character';
            return result
        }
        result.success = true;
        return result;
    }
}