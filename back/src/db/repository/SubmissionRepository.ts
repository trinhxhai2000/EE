import { DeleteResult, Repository } from "typeorm";
import { appDataSource } from "../data-source";
import { Submission } from "../entity/Submission";

export class SubmissionRepositoryController {
    private _repository: Repository<Submission>;
    constructor() {
        this._repository = appDataSource.getRepository(Submission);
    }

    public async add(recordId: number, choiceId: number = 0): Promise<Submission> {
        const newSubmission = { recordId, choiceId }
        const submission = await this._repository.save(newSubmission);
        return submission;
    }

    public async get(id: number): Promise<Submission> {
        const submission = await this._repository.findOneBy({ id });
        if (!submission) {
            throw new Error("Not found user");
        }
        return submission;
    }

    public async getAll(questionId: number): Promise<Submission[]> {
        return this._repository.createQueryBuilder("submission")
            .where(`submission.questionId = ${questionId}`)
            .getMany();
    }

    public async update(id: number, recordId: number, choiceId: number): Promise<Submission> {
        const submission = await this.get(id);
        submission.recordId = recordId;
        submission.choiceId = choiceId;
        this._repository.save(submission);
        return submission;
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

    public async paging(from: number, to: number, search: string): Promise<Submission[]> {
        return this._repository.createQueryBuilder("submission")
            .where("submission.description like :condition", { condition: "%" + search.toLowerCase() + "%" })
            .skip(from).take(to - from).getMany();
    }

    public async countWithCondition(condition: string): Promise<number> {
        const cnt = await this._repository.createQueryBuilder("submission")
            .where("submission.description like :condition", { condition: "%" + condition.toLowerCase() + "%" }).getCount();
        return cnt;
    }

}

export const submissionRepositoryController = new SubmissionRepositoryController();