import { Repository } from "typeorm";
import { appDataSource } from "../data-source";
import { User } from "../entity/User";

export class UserRepositoryController {
    private _userRepository: Repository<User>;

    constructor() {
        this._userRepository = appDataSource.getRepository(User);
    }

    public async addNewUser(input: User): Promise<User> {
        const user = await this._userRepository.save(input);
        //[todo] list case!
        return user;
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
