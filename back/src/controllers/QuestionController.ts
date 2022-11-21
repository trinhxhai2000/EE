import { Response, Request } from "express";
import { use } from "./decorators/use";
import { post, get } from "./decorators/routes";
import { controller } from "./decorators/controller";
import { asyncWrapper } from "./decorators/asyncWrapper";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import { requireAuth } from "../middlewares/requireAuth";

@controller('/api/v1/question')
export class QuestionController {
    // @asyncWrapper(true)
    @use(requireAuth)
    @get('/getAll')
    async paging(req: Request, res: Response) {
        res.status(StatusCodes.OK).json({ mes: 'u suck' });

        const query = req.query;
        console.log("query ", query)

        // let from: number = 0;
        // let to: number = 9999;
        // let search: string = query.search as string ?? "";

        res.status(StatusCodes.OK).json({
            success: false,
            message: 'fuck u asshole'
        });
    }
}
