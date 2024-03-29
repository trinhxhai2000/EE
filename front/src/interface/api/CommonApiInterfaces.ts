export interface DeleteResult {
    success: boolean;
    message?: string;
    id: number;
}

export interface CommonResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export interface DataResponse<T> {
    success: boolean;
    data?: T;
}


export interface GetAllResponse<T> {
    success: boolean;
    message?: string;
    data?: T[];
}
