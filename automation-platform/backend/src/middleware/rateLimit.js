import { Redis } from 'ioredis';
import { AppError } from '../utils/AppError.js';
export class RateLimiter {
    redis;
    options;
    constructor(options) {
        this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
        this.options = options;
    }
    middleware() {
        return async (req, res, next) => {
            try {
                const key = this.options.keyGenerator
                    ? this.options.keyGenerator(req)
                    : this.defaultKeyGenerator(req);
                const current = await this.redis.incr(key);
                if (current === 1) {
                    // Set expiration on first request
                    await this.redis.expire(key, Math.ceil(this.options.windowMs / 1000));
                }
                const ttl = await this.redis.ttl(key);
                const remaining = Math.max(0, this.options.max - current);
                // Set rate limit headers
                res.setHeader('X-RateLimit-Limit', this.options.max);
                res.setHeader('X-RateLimit-Remaining', remaining);
                res.setHeader('X-RateLimit-Reset', new Date(Date.now() + ttl * 1000).toISOString());
                if (current > this.options.max) {
                    throw AppError.tooManyRequests(`Rate limit exceeded. Try again in ${ttl} seconds.`);
                }
                next();
            }
            catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }
                // If Redis is down, allow the request (fail open)
                next();
            }
        };
    }
    defaultKeyGenerator(req) {
        // Use user ID if available, otherwise use IP
        const userId = req.user?.id;
        const identifier = userId ? `user:${userId}` : `ip:${req.ip}`;
        return `ratelimit:${identifier}:${req.path}`;
    }
}
// Pre-configured rate limiters
export const createRateLimiter = (options) => {
    return new RateLimiter(options).middleware();
};
// Common rate limiters
export const generalRateLimit = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
});
export const strictRateLimit = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 requests per hour
});
export const authRateLimit = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts per 15 minutes
    keyGenerator: (req) => `ratelimit:auth:${req.ip}`,
});
export const apiRateLimit = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000, // 1000 requests per hour for API
    keyGenerator: (req) => {
        const apiKey = req.headers['x-api-key'];
        return `ratelimit:api:${apiKey || req.ip}`;
    },
});
//# sourceMappingURL=rateLimit.js.map