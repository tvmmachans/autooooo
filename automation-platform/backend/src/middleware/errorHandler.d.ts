import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
export interface ErrorResponse {
    success: false;
    error: {
        message: string;
        code?: string;
        details?: any;
    };
    timestamp: string;
    path: string;
}
export declare const errorHandler: (err: Error | AppError, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map