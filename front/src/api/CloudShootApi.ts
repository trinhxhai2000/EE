import { ApiError } from "./ApiError";
import axios from "axios";
import { API_URL } from "../Enum/EnvironmentVariable";
import axiosClient from "./axiosClient";
import * as qs from "qs";
import type { CommonResponse, DataResponse } from "../interface/api/CommonApiInterfaces";

import { userSession, userSessionStore } from "../Stores/UserSessionStore";
import { get } from "svelte/store";
import type { AddResult } from "../interface/CommonInterfaces";
import type { StringOptions } from "sass";
import type { QuestionItem, QuestionTableData } from "../interface/api/QuestionInterfaces";
import type { QuestionData, StartGameData } from "../interface/api/CloudShootPlayData";

// auth api don't use token header so it will use its own axios client
// instead of "axiosClient.ts"
class CloudShootApi {
    constructor() { }

    // get 20 question and it's corresponding choices

    public async getStartingData(): Promise<DataResponse<StartGameData>> {

        const response = await axiosClient.get(
            "/cloud-shoot/starting-data",
            {
                headers: {
                    // "Content-Type": "application/x-www-form-urlencoded",
                },

            }
        );

        const result = response.data as DataResponse<StartGameData>;
        return result;
    }

    public async sendChoice(recordId: number, choiceId: number): Promise<CommonResponse> {
        const data = { recordId, choiceId };
        const response = await axiosClient.post(
            "/cloud-shoot/check-choice",
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

export const cloudShootApi = new CloudShootApi();
