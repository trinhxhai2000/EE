import { ApiError } from "./ApiError";
import axios from "axios";
import { API_URL } from "../Enum/EnvironmentVariable";
import axiosClient from "./axiosClient";
import * as qs from "qs";
import type { CommonResponse, GetAllResponse } from "../interface/api/CommonApiInterfaces";
import { userSession, userSessionStore } from "../Stores/UserSessionStore";
import { get } from "svelte/store";
import type { AddResult } from "../interface/CommonInterfaces";
import type { StringOptions } from "sass";
import type { ChoiceItem, ChoiceTableData } from "../interface/api/ChoiceInterfaces";

// auth api don't use token header so it will use its own axios client
// instead of "axiosClient.ts"
class ChoiceApi {
    constructor() { }

    paging = (
        page: any,
        pageSize: any,
        text: any,
        sorting: any
    ): Promise<ChoiceTableData> => {

        const from = page * pageSize;
        const to = from + pageSize;

        return new Promise((resolve, reject) => {
            axiosClient.get("/choice/paging", {
                params: {
                    from: from,
                    to: to,
                    search: text
                }
            }).then(
                res => {
                    resolve(res.data as ChoiceTableData);
                }
            ).catch(err => {
                reject(err);
            })
        });

    };

    public async add(questionId: number, description: string, isAnswer: boolean): Promise<CommonResponse> {
        const data = {
            questionId,
            description,
            isAnswer
        };
        const response = await axiosClient.post(
            "/choice/add",
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

    public async getAll(questionId: number): Promise<GetAllResponse<ChoiceItem>> {
        const data = { questionId };
        const response = await axiosClient.post(
            "/choice/getAll",
            qs.stringify(data),
            {
                headers: {
                    // "Content-Type": "application/x-www-form-urlencoded",
                },

            }
        );

        const result = response.data as GetAllResponse<ChoiceItem>;

        return result;
    }

    public async get(id: number): Promise<CommonResponse> {
        const data = { id };
        const response = await axiosClient.post(
            "/choice/get",
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

    public async update(id: number, description: string, isAnswer: boolean): Promise<CommonResponse> {
        const data = { id, description, isAnswer };
        const response = await axiosClient.post(
            "/choice/update",
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

    public async delete(id: number): Promise<CommonResponse> {
        const data = { id };
        const response = await axiosClient.post(
            "/choice/delete",
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

    public async deleteMany(ids: number[]): Promise<CommonResponse> {
        const data = { ids: ids };
        const response = await axiosClient.post(
            "/choice/delete-many",
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

export const choiceApi = new ChoiceApi();
