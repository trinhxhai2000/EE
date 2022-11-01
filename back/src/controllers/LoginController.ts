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
    @get("/login")
    async login(req: Request, res: Response) {
        const { username } = req.body;
        console.log("login", { username });

        try {
            const user = await userRepositoryController.getUser(username);
            // user = null ?
            res.status(StatusCodes.OK).json({
                success: true,
                data: user,
            });
        } catch (err) {
            // console.log("err", err);
            res.status(StatusCodes.OK).json({
                success: false,
            });
        }

        // const user = await UserModel.findOne({ username });

        // console.log('user', user);
        // if (user) {
        //   const payload = { username: user.username };
        //   user.comparePassword(password, (err: Error, isMatch: boolean) => {
        //     console.log('comparePassword', isMatch);
        //     if (isMatch) {
        //       const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        //         expiresIn: '30d',
        //       });

        //       console.log('Set cookie nek:', user);

        //       res.cookie(AUTH_COOKIE_KEY, token, {
        //         maxAge: 3000 * 9000,
        //         sameSite: 'none',
        //         secure: true,
        //         httpOnly: true,
        //         path: '/',
        //       });

        //       res.status(StatusCodes.OK).json({
        //         success: true,
        //         // user: { username: user.username, user_id: user._id },
        //       });
        //     } else {
        //       res.status(StatusCodes.OK).json({
        //         success: false,
        //         message: 'Invalid username or password!',
        //       });
        //       return;
        //     }
        //   });

        //   return;
        // } else {
        //   res
        //     .status(StatusCodes.OK)
        //     .json({ success: false, message: 'Invalid username or password!' });
        //   return;
        // }
    }

    // add require req.body: username, password
    @asyncWrapper(true)
    @post("/register")
    async register(req: Request, res: Response) {
        const username: string = req.body.username;
        const password: string = req.body.password;

        console.log("register", { username, password });
        console.log("req ", req.body);

        const newUser = {
            id: -1,
            username,
            password,
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

        // const user = await UserModel.findOne({ username });

        // if (!user) {
        //     try {
        //         await UserModel.create(req.body);
        //         res.status(StatusCodes.CREATED).json({ success: true });
        //     } catch (err) {
        //         res.status(StatusCodes.BAD_REQUEST).json({
        //             success: false,
        //             message: err,
        //         });
        //     }
        // } else {
        //     res.status(StatusCodes.BAD_REQUEST).json({
        //         success: false,
        //         message: `username ${username} exist !`,
        //     });
        // }
    }

    // @use(requireAuth)
    // @asyncWrapper(true)
    // @get("/getLoginUser")
    // async getLoginUser(req: Request, res: Response) {
    //     const username: string = req.body.username;
    //     console.log("getLoginUser", req.body);
    //     const user = await UserModel.findOne({ username });
    //     console.log("find user", user);
    //     if (user) {
    //         res.status(200).json({
    //             success: true,
    //             user: { username: user.username, user_id: user._id },
    //         });
    //     } else {
    //         res.status(200).json({ success: true, user: null });
    //     }
    // }

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
