import { envSchema } from './schema.js';
import { z } from 'zod';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
// Validate and parse environment variables
let config;
try {
    config = envSchema.parse(process.env);
}
catch (error) {
    if (error instanceof z.ZodError) {
        console.error('❌ Environment validation failed:');
        error.errors.forEach((err) => {
            console.error(`  - ${err.path.join('.')}: ${err.message}`);
        });
        process.exit(1);
    }
    throw error;
}
// Export validated config
export { config };
// Re-export for convenience
export default config;
//# sourceMappingURL=index.js.map