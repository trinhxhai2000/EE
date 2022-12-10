import e, { Response, Request } from "express";
import { use } from "./decorators/use";
import { post, get } from "./decorators/routes";
import { controller } from "./decorators/controller";
import { asyncWrapper } from "./decorators/asyncWrapper";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import { AUTH_COOKIE_KEY } from "../AppConst";
import { requireAuth } from "../middlewares/requireAuth";
import { userRepositoryController } from "../db/repository/UserRepository";

@controller("/api/v1/user")
export class UserController {
    @use(requireAuth)
    @asyncWrapper(true)
    @get("/paging")
    async paging(req: Request, res: Response) {
        const query = req.query;
        // console.log("paging user query", query)
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
            userRepositoryController.paging(from, to, search) ?? [],
            userRepositoryController.countWithCondition(search)
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
    @post("/get")
    async get(req: Request, res: Response) {
        const { username } = req.body;
        // console.log("/user/get params", { username })
        try {
            const user = await userRepositoryController.getUser(username);
            res.status(200).json({ success: true, data: user })
        } catch (err) {
            console.log("/user/get err", err)
            res.status(200).json({ success: false, message: 'Not found user!' })
        }
    }




    // edit user
    // - update password if need
    // - update authorization if need

    // @use(requireAuth)
    @asyncWrapper(true)
    @post("/update")
    async update(req: Request, res: Response) {

        const { username, role, password } = req.body;
        console.log("user update", { username, role, password })
        if (!username) {
            res.status(200).json({
                success: false,
                message: 'Invalid params'
            })
            return;
        }

        setTimeout(async () => {

            try {

                if (password) {
                    // do update
                    await userRepositoryController.adminChangePass(username, password);
                }
                if (role) {
                    await userRepositoryController.updateRole(username, role);
                }

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


    // @use(requireAuth)
    // @asyncWrapper(true)
    // @post('/logout')
    // async logout(req: Request, res: Response) {
    //     res.clearCookie(AUTH_COOKIE_KEY, {
    //         sameSite: 'none',
    //         secure: true,
    //         httpOnly: true,
    //         path: '/',
    //     });
    //     res.status(200).json({ success: true });
    // }

    // @use(requireAuth)
    // @asyncWrapper(true)
    // @post('/changepass')
    // async changepass(req: Request, res: Response) {
    //     const username: string = req.body.username;
    //     const password: string = req.body.password;
    //     const newPassword: string = req.body.newPassword;

    //     console.log("changepass", { username, password, newPassword });

    //     try {
    //         const user = await userRepositoryController.changePass(username, password, newPassword);
    //         if (user) {
    //             res.status(StatusCodes.OK).json({
    //                 message: 'Change password success!',
    //                 success: true,
    //             });
    //         } else {
    //             res.status(StatusCodes.OK).json({
    //                 message: 'Something went wrong, please try again later!',
    //                 success: false,
    //             });
    //         }



    //     } catch (err) {
    //         // console.log("err", err);
    //         if (err instanceof Error) {
    //             res.status(StatusCodes.OK).json({
    //                 success: false,
    //                 message: err.message
    //             });
    //         } else {
    //             throw new Error('WTF???');
    //         }

    //     }
    // }

}
