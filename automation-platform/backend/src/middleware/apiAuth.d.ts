import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    apiKey?: any;
    user?: any;
}
export declare const apiKeyAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireScope: (scope: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=apiAuth.d.ts.map