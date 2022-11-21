import { Repository } from "typeorm";
import { appDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from 'bcrypt';
export class UserRepositoryController {
    private _userRepository: Repository<User>;
    private salt: string;
    constructor() {
        this._userRepository = appDataSource.getRepository(User);
    }
    public async init() {
        this.salt = await bcrypt.genSalt(10);
    }

    public async addNewUser(input: User): Promise<User> {
        const user = await this._userRepository.save(input);
        //[todo] list case!
        return user;
    }
    public genHashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.salt);
    }
    public checkPassword(password: string, hashPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashPassword);
    }
    public async getUser(username: string): Promise<User> {
        const user = await this._userRepository.findOneBy({ username });
        if (!user) {
            throw new Error("Not found user");
        }
        return user;
    }

    // public async getAllUser(): Promise<User[]> {
    //     return this._userRepository.find();
    // }

    // public async findUserByWalletAddress(
    //     walletAddress: string
    // ): Promise<User | null> {}

    // public async saveUser(user: User): Promise<User | null> {}
}

export const userRepositoryController = new UserRepositoryController();