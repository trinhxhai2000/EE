export class ApiError extends Error {
    public code: number = 417;
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}