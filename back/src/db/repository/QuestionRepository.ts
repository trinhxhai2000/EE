import { DeleteResult, Repository } from "typeorm";
import { appDataSource } from "../data-source";
import { Question } from "../entity/Question";

export class QuestionRepositoryController {
    private _repository: Repository<Question>;
    constructor() {
        this._repository = appDataSource.getRepository(Question);
    }

    public async add(description: string): Promise<Question> {
        const question = await this._repository.save({ description });
        return question;
    }

    public async get(id: number): Promise<Question> {
        const question = await this._repository.findOneBy({ id });
        if (!question) {
            throw new Error("Not found user");
        }
        return question;
    }

    public async update(id: number, description: string): Promise<Question> {
        const question = await this.get(id);
        question.description = description;
        this._repository.save(question);
        return question;
    }

    public async delete(id: number): Promise<DeleteResult> {
        return await this._repository.delete({ id });
    }

    public async deleteMany(ids: number[]): Promise<DeleteResult> {
        return await this._repository.delete(ids)
    }
    public async deleteAll(): Promise<void> {
        return await this._repository.clear();
    }

    public async paging(from: number, to: number, search: string): Promise<Question[]> {
        return this._repository.createQueryBuilder("question")
            .where("question.description like :condition", { condition: "%" + search.toLowerCase() + "%" })
            .skip(from).take(to - from).getMany();
    }

    public async countWithCondition(condition: string): Promise<number> {
        const cnt = await this._repository.createQueryBuilder("question")
            .where("question.description like :condition", { condition: "%" + condition.toLowerCase() + "%" }).getCount();
        return cnt;
    }

    // edit
    // delete
    // public async saveQuestion(user: Question): Promise<Question | null> {}
}

export const questionRepositoryController = new QuestionRepositoryController();