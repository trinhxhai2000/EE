import { DeleteResult, Repository } from "typeorm";
import { appDataSource } from "../data-source";
import { Choice } from "../entity/Choice";

export class ChoiceRepositoryController {
    private _repository: Repository<Choice>;
    constructor() {
        this._repository = appDataSource.getRepository(Choice);
    }

    public async add(questionId: number, description: string, isAnswer: boolean): Promise<Choice> {

        const newChoice = { questionId, description, isAnswer }
        console.log("Repo say add choice", newChoice)
        const choice = await this._repository.save(newChoice);

        console.log("Repo say add after choice", choice)
        return choice;
    }

    public async get(id: number): Promise<Choice> {
        const choice = await this._repository.findOneBy({ id });
        if (!choice) {
            throw new Error("Not found user");
        }
        return choice;
    }
    public async getAll(questionId: number): Promise<Choice[]> {
        return this._repository.createQueryBuilder("choice")
            .where(`choice.questionId = ${questionId}`)
            .getMany();

    }

    public async update(id: number, description: string, isAnswer: boolean): Promise<Choice> {
        const choice = await this.get(id);
        choice.description = description;
        choice.isAnswer = isAnswer;
        this._repository.save(choice);
        return choice;
    }

    public async delete(id: number): Promise<DeleteResult> {
        return await this._repository.delete({ id });
    }

    public async deleteMany(ids: number[]): Promise<DeleteResult> {
        return await this._repository.delete(ids)
    }

    public async paging(from: number, to: number, search: string): Promise<Choice[]> {
        return this._repository.createQueryBuilder("choice")
            .where("choice.description like :condition", { condition: "%" + search.toLowerCase() + "%" })
            .skip(from).take(to - from).getMany();
    }

    public async countWithCondition(condition: string): Promise<number> {
        const cnt = await this._repository.createQueryBuilder("choice")
            .where("choice.description like :condition", { condition: "%" + condition.toLowerCase() + "%" }).getCount();
        return cnt;
    }

    // edit
    // delete
    // public async saveChoice(user: Choice): Promise<Choice | null> {}
}

export const choiceRepositoryController = new ChoiceRepositoryController();