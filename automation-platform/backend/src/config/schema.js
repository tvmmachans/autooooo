import { z } from 'zod';
// Environment variable validation schema
export const envSchema = z.object({
    // Server
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default('3001'),
    FRONTEND_URL: z.string().url().default('http://localhost:3000'),
    // Database
    DATABASE_URL: z.string().url(),
    DB_MAX_CONNECTIONS: z.string().transform(Number).default('10'),
    DB_IDLE_TIMEOUT: z.string().transform(Number).default('20'),
    DB_CONNECT_TIMEOUT: z.string().transform(Number).default('10'),
    // Redis
    REDIS_URL: z.string().url().default('redis://localhost:6379'),
    // JWT
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default('7d'),
    REFRESH_TOKEN_SECRET: z.string().min(32),
    REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),
    // AI Services
    SARVAM_API_KEY: z.string().optional(),
    GROQ_API_KEY: z.string().optional(),
    GEMINI_API_KEY: z.string().optional(),
    DEEPSEEK_API_KEY: z.string().optional(),
    // TTS
    TTS_API_URL: z.string().url().optional().default('http://localhost:8000'),
    TTS_STORAGE_PATH: z.string().default('./storage/audio'),
    // Media
    MEDIA_STORAGE_PATH: z.string().default('./storage/media'),
    MEDIA_PUBLIC_URL: z.string().default('/api/media'),
    // Logging
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    LOGS_DIR: z.string().default('./logs'),
    // Feature Flags
    ENABLE_RATE_LIMITING: z.string().transform(v => v === 'true').default('true'),
    ENABLE_API_KEYS: z.string().transform(v => v === 'true').default('true'),
});
//# sourceMappingURL=schema.js.map