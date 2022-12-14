import { Response, Request } from "express";
import { use } from "./decorators/use";
import { post, get } from "./decorators/routes";
import { controller } from "./decorators/controller";
import { asyncWrapper } from "./decorators/asyncWrapper";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import { requireAdmin } from "../middlewares/requireAdmin";
import { choiceRepositoryController } from "../db/repository/ChoiceRepository";

@controller('/api/v1/choice')
export class ChoiceController {

    @use(requireAdmin)
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
            choiceRepositoryController.paging(from, to, search) ?? [],
            choiceRepositoryController.countWithCondition(search)
        ]);

        res.status(200).json(
            {
                rows: lst,
                rowsCount: totalCount
            }
        );

        // res.status(200).json({ success: true });
    }


    @use(requireAdmin)
    @asyncWrapper(true)
    @post("/add")
    async add(req: Request, res: Response) {
        const { questionId, description, isAnswer } = req.body;
        console.log("/question/add params", description)
        try {
            const question = await choiceRepositoryController.add(questionId, description, isAnswer === 'true');
            res.status(200).json({ success: true, data: question })
        } catch (err) {
            console.log("/user/get err", err)
            res.status(200).json({ success: false, message: 'Not found user!' })
        }
    }

    @use(requireAdmin)
    @asyncWrapper(true)
    @post("/get")
    async get(req: Request, res: Response) {
        const { id } = req.body;
        // console.log("/user/get params", { username })
        try {
            const user = await choiceRepositoryController.get(id);
            res.status(200).json({ success: true, data: user })
        } catch (err) {
            console.log("/user/get err", err)
            res.status(200).json({ success: false, message: 'Not found user!' })
        }
    }

    // @use(requireAdmin)
    @asyncWrapper(true)
    @post("/getAll")
    async getAll(req: Request, res: Response) {
        const { questionId } = req.body;
        // console.log("/user/get params", { username })
        try {
            const choices = await choiceRepositoryController.getAll(questionId);
            // console.log("get all choice ", choices)
            res.status(200).json({ success: true, data: choices })
        } catch (err) {
            console.log("/user/get err", err)
            res.status(200).json({ success: false, message: 'Not found user!' })
        }
    }

    // edit user
    // - update password if need
    // - update authorization if need

    @use(requireAdmin)
    @asyncWrapper(true)
    @post("/update")
    async update(req: Request, res: Response) {

        const { id, description, isAnswer } = req.body;
        console.log("user update", { id, description, isAnswer })
        if (!id || !description) {
            res.status(200).json({
                success: false,
                message: 'Invalid params'
            })
            return;
        }

        setTimeout(async () => {

            try {

                await choiceRepositoryController.update(id, description, isAnswer === 'true');
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

    @use(requireAdmin)
    @asyncWrapper(true)
    @post("/delete")
    async delete(req: Request, res: Response) {

        const { id } = req.body;
        console.log("user delete", { id })
        if (!id) {
            res.status(200).json({
                success: false,
                message: 'Invalid params'
            })
            return;
        }

        setTimeout(async () => {

            try {

                await choiceRepositoryController.delete(id);
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

    @use(requireAdmin)
    @asyncWrapper(true)
    @post("/delete-many")
    async deleteMany(req: Request, res: Response) {

        let ids: number[] = [];
        try {
            ids = req.body.ids as number[];
        } catch (err) {
            if (!ids) {
                res.status(200).json({
                    success: false,
                    message: 'Invalid params'
                })
                return;
            }
        }
        console.log("deletemany", ids)
        setTimeout(async () => {

            try {

                await choiceRepositoryController.deleteMany(ids);
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
