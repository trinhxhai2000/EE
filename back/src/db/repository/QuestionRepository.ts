import { Repository } from "typeorm";
import { appDataSource } from "../data-source";
import { Question } from "../entity/Question";

export class QuestionRepositoryController {
    private _repository: Repository<Question>;
    constructor() {
        this._repository = appDataSource.getRepository(Question);
    }

    public async addQuestion(description: string): Promise<Question> {
        const question = await this._repository.save({ description });
        return question;
    }

    public async getQuestion(id: number): Promise<Question> {
        const question = await this._repository.findOneBy({ id });
        if (!question) {
            throw new Error("Not found user");
        }
        return question;
    }

    public async getAllQuestion(): Promise<Question[]> {
        return this._repository.find();
    }

    // public async saveQuestion(user: Question): Promise<Question | null> {}
}

export const quesRepo = new QuestionRepositoryController();

//[warn] the way of gen/init value of salt !!