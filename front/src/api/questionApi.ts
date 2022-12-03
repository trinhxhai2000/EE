import { ApiError } from "./ApiError";
import axios from "axios";
import { API_URL } from "../Enum/EnvironmentVariable";
import type { User } from "../interface/entity/User";
import axiosClient from "./axiosClient";
import type { CommonResponse } from "../interface/api/CommonApiInterfaces";
import type { Question } from "../interface/entity/Question";

class QuestionApi {
    public suffixURL = '/question';
    constructor() { }

    public async paging(): Promise<Question[]> {
        const response = await axiosClient.get(
            this.suffixURL + "/getAll",
            {
                headers: {
                    // "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        console.log("getAll question response", response);
        return response.data as Question[];
    }

    public async isCorrectOption(questionId: number, optionId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                if (Math.random() * 10 < 3) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 2000);
        });
    }

}

export const questionApi = new QuestionApi();
