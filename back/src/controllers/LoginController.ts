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
import { ROLES } from "../db/entity/User";

@controller("/api/v1")
export class LoginController {
    // add require req.body: username, password
    @asyncWrapper(true)
    @post("/login")
    async login(req: Request, res: Response) {
        const { username, password } = req.body;
        // console.log("login", { username, password });

        try {
            const user = await userRepositoryController.getUser(username);

            const isMatchPassword = await userRepositoryController.checkPassword(password, user.hashPassword);

            // console.log("login", { hashPass: user.hashPassword, password, isMatchPassword })
            if (isMatchPassword) {
                // user = null ?
                const payload = { username: user.username, role: user.role };
                const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
                    expiresIn: '30d',
                });


                res.cookie(AUTH_COOKIE_KEY, token, {
                    maxAge: 3000 * 9000,
                    sameSite: 'none',
                    secure: true,
                    httpOnly: true,
                    path: '/',
                });


                res.status(StatusCodes.OK).json({
                    success: true,
                    data: { username, role: user.role }
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
            if (err instanceof Error) {
                if (err.message === 'Not found user') {
                    res.status(StatusCodes.OK).json({
                        success: false,
                        message: 'Wrong username or password!',
                    });
                }

            } else {
                res.status(StatusCodes.OK).json({
                    success: false,
                });
            }

        }

    }

    // add require req.body: username, password
    @asyncWrapper(true)
    @post("/register")
    async register(req: Request, res: Response) {
        const username: string = req.body.username;
        const password: string = req.body.password;

        const hashPassword = await userRepositoryController.genHashPassword(password);


        if (!username || !password) {
            res.status(StatusCodes.OK).json({
                success: false,
            });
            return;
        }


        if (password.length < 5) {
            res.status(StatusCodes.OK).json({
                success: false,
                message: 'Password should have at least 5 character!'
            });
            return;
        }

        const role = ROLES.USER;

        const newUser = {
            id: -1,
            username,
            role,
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
        const user = await userRepositoryController.getUser(username);
        if (user) {
            res.status(200).json({
                success: true,
                data: { username: user.username, id: user.id, role: user.role },
            });
        } else {
            res.status(200).json({ success: true, user: null });
        }
    }

    @use(requireAuth)
    @asyncWrapper(true)
    @post('/logout')
    async logout(req: Request, res: Response) {
        res.clearCookie(AUTH_COOKIE_KEY, {
            sameSite: 'none',
            secure: true,
            httpOnly: true,
            path: '/',
        });
        res.status(200).json({ success: true });
    }

    @use(requireAuth)
    @asyncWrapper(true)
    @post('/changepass')
    async changepass(req: Request, res: Response) {
        const username: string = req.body.username;
        const password: string = req.body.password;
        const newPassword: string = req.body.newPassword;

        try {
            const user = await userRepositoryController.changePass(username, password, newPassword);
            if (user) {
                res.status(StatusCodes.OK).json({
                    message: 'Change password success!',
                    success: true,
                });
            } else {
                res.status(StatusCodes.OK).json({
                    message: 'Something went wrong, please try again later!',
                    success: false,
                });
            }



        } catch (err) {
            // console.log("err", err);
            if (err instanceof Error) {
                res.status(StatusCodes.OK).json({
                    success: false,
                    message: err.message
                });
            } else {
                throw new Error('WTF???');
            }

        }
    }

}
