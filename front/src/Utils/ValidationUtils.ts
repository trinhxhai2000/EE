export interface ValidationResult {
    success: boolean,
    message: string,
}

export class ValidationUtils {
    public static emptyMessage(paramName: string): string {
        return `${paramName} can't be empty !`
    }
}
