import { ApiError } from "./ApiError";
import axios from "axios";
import { API_URL } from "../Enum/EnvironmentVariable";
import type { User } from "../interface/entity/User";
import axiosClient from "./axiosClient";
import * as qs from "qs";
import type { CommonResponse } from "../interface/api/CommonApiInterfaces";
import { userSession, userSessionStore } from "../Stores/UserSessionStore";
import { get } from "svelte/store";
import type { UserTableData } from "../interface/api/UserInterfaces";
import type { AddResult } from "../interface/CommonInterfaces";
import type { StringOptions } from "sass";

// auth api don't use token header so it will use its own axios client
// instead of "axiosClient.ts"
class UserApi {
    constructor() { }

    public async changePassword(password: string, newPassword: string): Promise<CommonResponse> {
        const currentUser = get(userSession);
        if (currentUser === null) {
            throw new Error('You are not login! Please login ang try again!');
        }
        const data = { username: currentUser.username, password, newPassword };

        const response = await axiosClient.post(
            "/changepass",
            qs.stringify(data),
            {
                headers: {
                    // "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        return response.data as CommonResponse;
    }

    paging = (
        page: any,
        pageSize: any,
        text: any,
        sorting: any
    ): Promise<UserTableData> => {

        const from = page * pageSize;
        const to = from + pageSize;

        return new Promise((resolve, reject) => {
            axiosClient.get("/user/paging", {
                params: {
                    from: from,
                    to: to,
                    search: text
                }
            }).then(
                res => {
                    resolve(res.data as UserTableData);
                }
            ).catch(err => {
                reject(err);
            })
        });

    };

    addMapType = (name: string): Promise<AddResult> => {
        return new Promise((resolve, reject) => {
            axiosClient.post("/mapType/add", {
                name
            }).then(
                res => {
                    resolve(res.data as AddResult);
                }
            ).catch(err => {
                console.error(err.response);
                reject(err);
            })
        });
    };

    public async get(username: string): Promise<CommonResponse> {
        const data = { username };
        const response = await axiosClient.post(
            "/user/get",
            qs.stringify(data),
            {
                headers: {
                    // "Content-Type": "application/x-www-form-urlencoded",
                },

            }
        );

        const result = response.data as CommonResponse;

        return result;
    }

    public async update(username: string, password: string | undefined, role: string | undefined): Promise<CommonResponse> {
        const data = { username, password, role };
        const response = await axiosClient.post(
            "/user/update",
            qs.stringify(data),
            {
                headers: {
                    // "Content-Type": "application/x-www-form-urlencoded",
                },

            }
        );

        const result = response.data as CommonResponse;

        return result;
    }



}

export const userApi = new UserApi();
