import { ApiError } from "./ApiError";
import axios from "axios";
import { API_URL } from "../Enum/EnvironmentVariable";
import type { User } from "../interface/entity/User";
import axiosClient from "./axiosClient";
import * as qs from "qs";
import type { CommonResponse } from "../interface/api/CommonApiInterfaces";

// auth api don't use token header so it will use its own axios client
// instead of "axiosClient.ts"
class AuthApi {
    constructor() { }

    public async register(username: string, password: string): Promise<User> {
        const data = { username, password };

        const response = await axiosClient.post(
            "/register",
            qs.stringify(data),
            {
                headers: {
                    // "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        console.log("register response", response);
        return response.data as User;
    }
    public async login(username: string, password: string): Promise<CommonResponse> {
        const data = { username, password };

        const response = await axiosClient.post(
            "/login",
            qs.stringify(data),
            {
                headers: {
                    // "Content-Type": "application/x-www-form-urlencoded",
                },

            }
        );
        // console.log("register response", response);
        return response.data as CommonResponse;
    }

    public async getLoginUser(): Promise<CommonResponse> {

        const response = await axiosClient.get(
            "/getLoginUser",
            {
                headers: {
                    // "Content-Type": "application/x-www-form-urlencoded",
                },
                withCredentials: true,
            }
        );
        // console.log("register response", response);
        return response.data as CommonResponse;
    }
}

export const authApi = new AuthApi();
