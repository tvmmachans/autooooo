import { Request, Response, NextFunction } from 'express';
interface RateLimitOptions {
    windowMs: number;
    max: number;
    keyGenerator?: (req: Request) => string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}
export declare class RateLimiter {
    private redis;
    private options;
    constructor(options: RateLimitOptions);
    middleware(): (req: Request, res: Response, next: NextFunction) => Promise<void>;
    private defaultKeyGenerator;
}
export declare const createRateLimiter: (options: RateLimitOptions) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const generalRateLimit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const strictRateLimit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authRateLimit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const apiRateLimit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=rateLimit.d.ts.map