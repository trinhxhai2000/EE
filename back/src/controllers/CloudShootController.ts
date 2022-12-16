import { Response, Request } from "express";
import { use } from "./decorators/use";
import { post, get } from "./decorators/routes";
import { controller } from "./decorators/controller";
import { asyncWrapper } from "./decorators/asyncWrapper";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import { requireAdmin } from "../middlewares/requireAdmin";
import { recordRepositoryController } from "../db/repository/RecordRepositoty";
import { requireAuth } from "../middlewares/requireAuth";
import { questionRepositoryController } from "../db/repository/QuestionRepository";
import { choiceRepositoryController } from "../db/repository/ChoiceRepository";
import { CloudShootHelper } from "../db/logic/CloudShootHelper";
import { submissionRepositoryController } from "../db/repository/SubmissionRepository";


interface ChoiceItem {
    id: number;
    description: string;
    isAnswer: boolean;
}


interface QuestionData {
    id: number;
    description: string;
    choices: ChoiceItem[]; // all isAnswer = false
}

export interface StartGameData {
    recordId: number,
    questions: QuestionData[]
}


@controller('/api/v1/cloud-shoot')
export class ChoiceController {

    @use(requireAuth)
    @asyncWrapper(true)
    @get("/starting-data")
    async getQuestionData(req: Request, res: Response) {


        /// Create an record and return startingGameData
        try {

            const { username } = req.body;
            if (!username) {
                throw new Error('You are not login yeT1')
            }

            const record = await recordRepositoryController.add(username);

            let returnData: StartGameData = {
                recordId: record.id,
                questions: []
            };

            // 0. từ request lấy ra tên username
            // 1. từ username -> chọn 1 tập 20 câu hỏi sao cho phù hợp

            // for now just return simple random question
            const questions = await questionRepositoryController.paging(1, 20, '');

            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];
                const choices = await choiceRepositoryController.getAll(q.id);

                const { wrongChoices, correctChoices } = CloudShootHelper.fillRandomChoice(choices, 3, 7);

                let returnChoices = [...wrongChoices, ...correctChoices];
                returnChoices = CloudShootHelper.suffle(returnChoices);
                for (let i = 0; i < returnChoices.length; i++) {
                    returnChoices[i].isAnswer = false;
                }
                // remove correctness data from choices
                // return specific number of correct choice and wrong choice

                returnData.questions.push({
                    id: q.id,
                    description: q.description,
                    choices: returnChoices
                })
            }

            setTimeout(async () => {

                res.status(200).json({
                    success: true,
                    data: returnData
                })

            }, 2000)


        } catch (err) {
            res.status(200).json({
                success: false,
            })
            console.error(err)
        }
    }

    @use(requireAuth)
    @asyncWrapper(true)
    @post("/check-choice")
    async checkChoice(req: Request, res: Response) {
        const { username, recordId, choiceId } = req.body;
        // add submission & return the correctness

        console.log("/cloud-shoot/check-choice", { recordId, choiceId })
        try {

            if (!recordId || !choiceId) {
                throw new Error(`Invalid request's params`)
            }

            await submissionRepositoryController.add(recordId, choiceId);



            const choice = await choiceRepositoryController.get(choiceId);
            console.log("choice", choice)

            const record = await recordRepositoryController.get(recordId);

            if (choice.isAnswer) {
                await recordRepositoryController.update(recordId, record.result + 10);
            }


            res.status(200).json({
                success: true, data: {
                    isAnswer: choice.isAnswer
                }
            })
        } catch (err) {
            console.log("/user/get err", err)
            res.status(200).json({ success: false, message: 'Not found user!' })
        }
    }

}
