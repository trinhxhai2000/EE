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

    public async getUserWithRole(username: string): Promise<User> {
        const user = await this._userRepository.findOneBy({ username });
        if (!user) {
            throw new Error("Not found user");
        }
        return user;
    }

    public async changePass(username: string, password: string, newPassword: string): Promise<User> {

        const user = await this._userRepository.findOneBy({ username });

        if (!user) {
            throw new Error("Not found user");
        }

        const isMatchPassword = await this.checkPassword(password, user.hashPassword);
        if (!isMatchPassword) {
            if (!user) {
                throw new Error("Current password not correct");
            }
        }

        const hashPassword = await this.genHashPassword(newPassword);

        user.hashPassword = hashPassword;
        this._userRepository.save(user);

        return user;
    }

    public async adminChangePass(username: string, newPassword: string): Promise<User> {

        const user = await this._userRepository.findOneBy({ username });

        if (!user) {
            throw new Error("Not found user");
        }

        const hashPassword = await this.genHashPassword(newPassword);

        user.hashPassword = hashPassword;
        this._userRepository.save(user);

        return user;
    }
    public async updateRole(username: string, role: string): Promise<User> {

        const user = await this._userRepository.findOneBy({ username });

        if (!user) {
            throw new Error("Not found user");
        }
        user.role = role;
        this._userRepository.save(user);

        return user;
    }

    public async getAllUser(): Promise<User[]> {
        return this._userRepository.find();
    }

    public async paging(from: number, to: number, search: string): Promise<User[]> {
        return this._userRepository.createQueryBuilder("user")
            .where("user.username like :condition", { condition: "%" + search.toLowerCase() + "%" })
            .skip(from).take(to - from).getMany();
    }

    public async countWithCondition(condition: string): Promise<number> {
        const cnt = await this._userRepository.createQueryBuilder("user")
            .where("user.username like :condition", { condition: "%" + condition.toLowerCase() + "%" }).getCount();
        return cnt;
    }

    public async deleteAll(): Promise<void> {
        return await this._userRepository.clear();
    }



    // public async findUserByWalletAddress(
    //     walletAddress: string
    // ): Promise<User | null> {}

    // public async saveUser(user: User): Promise<User | null> {}
}

export const userRepositoryController = new UserRepositoryController();