import { DeleteResult, Repository } from "typeorm";
import { appDataSource } from "../data-source";
import { Record } from "../entity/Record";

export class RecordRepositoryController {
    private _repository: Repository<Record>;
    constructor() {
        this._repository = appDataSource.getRepository(Record);
    }

    public async add(username: string, result: number = 0): Promise<Record> {
        const newRecord = { username, result }
        const record = await this._repository.save(newRecord);
        return record;
    }

    public async get(id: number): Promise<Record> {
        const record = await this._repository.findOneBy({ id });
        if (!record) {
            throw new Error("Not found user");
        }
        return record;
    }

    public async getAll(questionId: number): Promise<Record[]> {
        return this._repository.createQueryBuilder("record")
            .where(`record.questionId = ${questionId}`)
            .getMany();
    }

    public async update(id: number, result: number): Promise<Record> {
        const record = await this.get(id);
        record.result = result;
        this._repository.save(record);
        return record;
    }

    public async delete(id: number): Promise<DeleteResult> {
        return await this._repository.delete({ id });
    }
    public async deleteAll(): Promise<void> {
        return await this._repository.clear();
    }

    public async deleteMany(ids: number[]): Promise<DeleteResult> {
        return await this._repository.delete(ids)
    }

    public async paging(from: number, to: number, search: string): Promise<Record[]> {
        return this._repository.createQueryBuilder("record")
            .where("record.description like :condition", { condition: "%" + search.toLowerCase() + "%" })
            .skip(from).take(to - from).getMany();
    }

    public async countWithCondition(condition: string): Promise<number> {
        const cnt = await this._repository.createQueryBuilder("record")
            .where("record.description like :condition", { condition: "%" + condition.toLowerCase() + "%" }).getCount();
        return cnt;
    }

}

export const recordRepositoryController = new RecordRepositoryController();