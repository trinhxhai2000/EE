import axios from "axios";
// import queryString from "query-string";
import { API_URL } from "../Enum/EnvironmentVariable";
// import { localStore } from "../stores/LocalStore";

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        // "Content-Type": "application/json",
        // "content-Type": "application/x-www-form-urlencoded",
        // "Content-Type": "application/x-www-form-urlencoded",
    },
    withCredentials: true,
    // paramsSerializer: (params) => queryString.stringify(params),
});

// axiosClient.interceptors.request.use(async (config) => {
//     // Handle token here...
//     if (localStore.getAuthToken()) config.headers["Authorization"] = localStore.getAuthToken();
//     return config;
// });

// axiosClient.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (error) => {
//         return error.response;
//     }
// );
export default axiosClient;
