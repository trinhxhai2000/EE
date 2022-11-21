import { Response, Request } from "express";
import { use } from "./decorators/use";
import { post, get } from "./decorators/routes";
import { controller } from "./decorators/controller";
import { asyncWrapper } from "./decorators/asyncWrapper";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import { AUTH_COOKIE_KEY } from "../AppConst";
import { requireAuth } from "../middlewares/requireAuth";
import { userRepositoryController } from "../db/repository/UserRepository";

@controller("/api/v1")
export class LoginController {
    // add require req.body: username, password
    @asyncWrapper(true)
    @post("/login")
    async login(req: Request, res: Response) {
        const { username, password } = req.body;
        console.log("login", { username, password });

        try {
            const user = await userRepositoryController.getUser(username);

            const isMatchPassword = await userRepositoryController.checkPassword(password, user.hashPassword);

            console.log("login", { hashPass: user.hashPassword, password, isMatchPassword })
            if (isMatchPassword) {
                // user = null ?
                console.log("fuck ?", { x: process.env.JWT_SECRET })
                const payload = { username: user.username };
                const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
                    expiresIn: '30d',
                });

                console.log('Set cookie nek:', user);

                res.cookie(AUTH_COOKIE_KEY, token, {
                    maxAge: 3000 * 9000,
                    sameSite: 'none',
                    secure: true,
                    httpOnly: true,
                    path: '/',
                });


                res.status(StatusCodes.OK).json({
                    success: true,
                    // data: payload,
                });
            } else {
                res.status(StatusCodes.OK).json({
                    message: 'Wrong username or password!',
                    success: false,
                });
            }


        } catch (err) {
            // console.log("err", err);
            res.status(StatusCodes.OK).json({
                success: false,
            });
        }

    }

    // add require req.body: username, password
    @asyncWrapper(true)
    @post("/register")
    async register(req: Request, res: Response) {
        const username: string = req.body.username;
        const password: string = req.body.password;

        const hashPassword = await userRepositoryController.genHashPassword(password);

        console.log("register", { username, password, hashPassword });
        // console.log("req ", req.body);

        if (!username || !password) {
            res.status(StatusCodes.OK).json({
                success: false,
            });
            return;
        }

        const newUser = {
            id: -1,
            username,
            hashPassword,
            createdDate: new Date(),
            updatedDate: new Date(),
        };

        try {
            const user = await userRepositoryController.addNewUser(newUser);

            // return new Promise<>
            res.status(StatusCodes.OK).json({
                success: true,
                message: "create user success!",
                user,
            });
        } catch (err) {
            console.log("userRepositoryController.addNewUser err", err);
            res.status(StatusCodes.OK).json({
                success: false,
            });
        }
    }

    @use(requireAuth)
    @asyncWrapper(true)
    @get("/getLoginUser")
    async getLoginUser(req: Request, res: Response) {
        const username: string = req.body.username;
        console.log("getLoginUser", req.body);
        const user = await userRepositoryController.getUser(username);
        console.log("find user", user);
        if (user) {
            res.status(200).json({
                success: true,
                data: { username: user.username, id: user.id },
            });
        } else {
            res.status(200).json({ success: true, user: null });
        }
    }

    // @use(requireAuth)
    // @asyncWrapper(true)
    // @post('/logout')
    // async logout(req: Request, res: Response) {
    //   res.clearCookie(AUTH_COOKIE_KEY, {
    //     sameSite: 'none',
    //     secure: true,
    //     httpOnly: true,
    //     path: '/',
    //   });
    //   res.status(200).json({ success: 200 });
    // }
}
