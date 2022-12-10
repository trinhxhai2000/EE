import { ApiError } from "./ApiError";
import axios from "axios";
import { API_URL } from "../Enum/EnvironmentVariable";
import axiosClient from "./axiosClient";
import * as qs from "qs";
import type { CommonResponse } from "../interface/api/CommonApiInterfaces";
import { userSession, userSessionStore } from "../Stores/UserSessionStore";

// auth api don't use token header so it will use its own axios client
// instead of "axiosClient.ts"
class AuthApi {
    constructor() { }

    public async register(username: string, password: string): Promise<CommonResponse> {
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
        return response.data as CommonResponse;
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
        const result = response.data as CommonResponse;
        if (result.success) {
            userSessionStore.login(result.data.username, result.data.role);
        }

        return result;
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
        const result = response.data as CommonResponse;
        if (result.success) {
            userSessionStore.login(result.data.username, result.data.role);
        }
        // console.log("register response", response);
        return result;
    }

    public async logout(): Promise<CommonResponse> {
        const response = await axiosClient.post(
            "/logout",
            {
                headers: {
                    // "Content-Type": "application/x-www-form-urlencoded",
                },

            }
        );
        const result = response.data as CommonResponse;
        if (result.success) {
            userSessionStore.logout();
        }

        // console.log("register response", response);
        return response.data as CommonResponse;
    }
}

export const authApi = new AuthApi();
