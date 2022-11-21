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
