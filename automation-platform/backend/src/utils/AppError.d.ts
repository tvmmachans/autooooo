export declare class AppError extends Error {
    statusCode: number;
    code: string;
    details?: any;
    isOperational: boolean;
    constructor(message: string, statusCode?: number, code?: string, details?: any, isOperational?: boolean);
    private static vercelErrorMap;
    static badRequest(message: string, details?: any): AppError;
    static unauthorized(message?: string): AppError;
    static forbidden(message?: string): AppError;
    static notFound(message?: string): AppError;
    static conflict(message: string, details?: any): AppError;
    static tooManyRequests(message?: string): AppError;
    static internal(message?: string, details?: any): AppError;
    static vercelError(code: string, message?: string, details?: any): AppError;
}
//# sourceMappingURL=AppError.d.ts.map