import { Response, Request } from "express";
import { use } from "./decorators/use";
import { post, get } from "./decorators/routes";
import { controller } from "./decorators/controller";
import { asyncWrapper } from "./decorators/asyncWrapper";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import { requireAuth } from "../middlewares/requireAuth";
import { questionRepositoryController } from "../db/repository/QuestionRepository";

@controller('/api/v1/question')
export class QuestionController {

    @use(requireAuth)
    @asyncWrapper(true)
    @get("/paging")
    async paging(req: Request, res: Response) {
        const query = req.query;
        console.log("paging question query", query)
        let from: number = 0;
        let to: number = 9999;
        let search: string = query.search as string ?? "";
        try {
            from = parseInt(query.from?.toString() ?? "0");
            to = parseInt(query.to?.toString() ?? "9999");
        } catch (err) {
            res.status(200).json({ success: false, message: 'Invalid params!' });
        }

        if (isNaN(from) || isNaN(to)) {
            throw new Error("Wrong parameter");
        }

        if (to <= from) to = from + 1;

        if (search) {
            search = search.toLocaleLowerCase();
        }
        const [lst, totalCount] = await Promise.all([
            questionRepositoryController.paging(from, to, search) ?? [],
            questionRepositoryController.countWithCondition(search)
        ]);

        res.status(200).json(
            {
                rows: lst,
                rowsCount: totalCount
            }
        );

        // res.status(200).json({ success: true });
    }


    @use(requireAuth)
    @asyncWrapper(true)
    @post("/add")
    async add(req: Request, res: Response) {
        const { description } = req.body;
        console.log("/question/add params", description)
        try {
            const question = await questionRepositoryController.add(description);
            res.status(200).json({ success: true, data: question })
        } catch (err) {
            console.log("/user/get err", err)
            res.status(200).json({ success: false, message: 'Not found user!' })
        }
    }

    @use(requireAuth)
    @asyncWrapper(true)
    @post("/get")
    async get(req: Request, res: Response) {
        const { id } = req.body;
        // console.log("/user/get params", { username })
        try {
            const user = await questionRepositoryController.get(id);
            res.status(200).json({ success: true, data: user })
        } catch (err) {
            console.log("/user/get err", err)
            res.status(200).json({ success: false, message: 'Not found user!' })
        }
    }

    // edit user
    // - update password if need
    // - update authorization if need

    @use(requireAuth)
    @asyncWrapper(true)
    @post("/update")
    async update(req: Request, res: Response) {

        const { id, description } = req.body;
        console.log("user update", { id, description })
        if (!id || !description) {
            res.status(200).json({
                success: false,
                message: 'Invalid params'
            })
            return;
        }

        setTimeout(async () => {

            try {

                await questionRepositoryController.update(id, description);
                res.status(200).json({ success: true })

            } catch (err) {
                if (err instanceof Error) {
                    if (err.message) {
                        res.status(200).json({ success: false, message: err.message });
                    } else {
                        res.status(200).json({ success: false });
                    }
                }

            }

        }, 1000)


    }


}
