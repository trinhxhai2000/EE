import { ApiError } from "./ApiError";
import axios from "axios";
import { API_URL } from "../Enum/EnvironmentVariable";
import axiosClient from "./axiosClient";
import * as qs from "qs";
import type { CommonResponse } from "../interface/api/CommonApiInterfaces";
import { userSession, userSessionStore } from "../Stores/UserSessionStore";
import { get } from "svelte/store";
import type { AddResult } from "../interface/CommonInterfaces";
import type { StringOptions } from "sass";
import type { QuestionItem, QuestionTableData } from "../interface/api/QuestionInterfaces";

// auth api don't use token header so it will use its own axios client
// instead of "axiosClient.ts"
class QuestionApi {
    constructor() { }

    paging = (
        page: any,
        pageSize: any,
        text: any,
        sorting: any
    ): Promise<QuestionTableData> => {

        const from = page * pageSize;
        const to = from + pageSize;

        return new Promise((resolve, reject) => {
            axiosClient.get("/question/paging", {
                params: {
                    from: from,
                    to: to,
                    search: text
                }
            }).then(
                res => {
                    resolve(res.data as QuestionTableData);
                }
            ).catch(err => {
                reject(err);
            })
        });

    };

    public async add(description: string): Promise<CommonResponse> {
        const data = {
            description
        };
        const response = await axiosClient.post(
            "/question/add",
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

    public async get(id: number): Promise<CommonResponse> {
        const data = { id };
        const response = await axiosClient.post(
            "/question/get",
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

    public async update(id: number, description: string): Promise<CommonResponse> {
        const data = { id, description };
        const response = await axiosClient.post(
            "/question/update",
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

export const questionApi = new QuestionApi();
