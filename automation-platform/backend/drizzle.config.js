import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
export default defineConfig({
    schema: './src/database/schema.ts',
    out: './src/database/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    verbose: true,
    strict: true,
    // Migration configuration
    migrations: {
        prefix: 'timestamp', // Use timestamp prefix for migration files
        table: '__drizzle_migrations__', // Custom migrations table name
    },
    // Environment-specific settings
    ...(isProduction && {
        // In production, be more conservative
        strict: true,
        verbose: false,
    }),
    // Custom breakpoints for large migrations
    breakpoints: true,
    // TypeScript configuration
    tsconfig: './tsconfig.json',
});
//# sourceMappingURL=drizzle.config.js.map