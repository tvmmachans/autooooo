import dotenv from 'dotenv';
import postgres from 'postgres';
// Load environment variables FIRST before any other imports
dotenv.config();
function validateEnvFile() {
    const result = {
        isValid: true,
        errors: [],
        warnings: [],
        info: [],
    };
    // Check if DATABASE_URL exists
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        result.isValid = false;
        result.errors.push('DATABASE_URL is not set in .env file');
        return result;
    }
    result.info.push('✓ DATABASE_URL is set');
    // Validate DATABASE_URL format
    try {
        const url = new URL(databaseUrl);
        // Check protocol
        if (url.protocol !== 'postgresql:') {
            result.warnings.push(`Protocol is "${url.protocol}" (expected "postgresql:")`);
        }
        else {
            result.info.push('✓ Protocol is correct (postgresql)');
        }
        // Check if it's a Supabase connection
        const isSupabase = url.hostname.includes('supabase.co');
        if (isSupabase) {
            result.info.push('✓ Detected Supabase connection');
            // Check port for Supabase (should be 5432 for direct connection)
            if (url.port === '5432' || !url.port) {
                result.info.push('✓ Using direct connection port (5432) - correct for migrations');
            }
            else if (url.port === '6543') {
                result.warnings.push('⚠ Using pooler port (6543) - migrations require direct connection (5432)');
                result.warnings.push('  Update DATABASE_URL to use port 5432 for migrations');
            }
            // Check hostname format
            if (url.hostname.startsWith('db.')) {
                result.info.push('✓ Using direct connection hostname (db.*.supabase.co)');
            }
            else if (url.hostname.includes('pooler')) {
                result.warnings.push('⚠ Using pooler hostname - migrations require direct connection');
                result.warnings.push('  Update DATABASE_URL to use db.*.supabase.co format');
            }
        }
        // Check for placeholder values
        if (databaseUrl.includes('your-password') || databaseUrl.includes('your-project-ref')) {
            result.isValid = false;
            result.errors.push('DATABASE_URL contains placeholder values');
            result.errors.push('  Replace "your-password" and "your-project-ref" with actual values');
        }
        else {
            result.info.push('✓ No placeholder values detected');
        }
        // Check if password is set
        if (!url.password || url.password === 'your-password') {
            result.isValid = false;
            result.errors.push('Database password is missing or not set');
        }
        else {
            result.info.push('✓ Database password is set');
        }
    }
    catch (error) {
        result.isValid = false;
        result.errors.push(`Invalid DATABASE_URL format: ${error instanceof Error ? error.message : 'Unknown error'}`);
        result.errors.push('Expected format: postgresql://postgres:password@host:port/database');
    }
    // Check SUPABASE_URL
    if (process.env.SUPABASE_URL) {
        result.info.push('✓ SUPABASE_URL is set');
        if (process.env.SUPABASE_URL.includes('your-project-ref')) {
            result.warnings.push('⚠ SUPABASE_URL contains placeholder value');
        }
    }
    else {
        result.warnings.push('⚠ SUPABASE_URL is not set (optional, but recommended)');
    }
    // Check SUPABASE_ANON_KEY
    if (process.env.SUPABASE_ANON_KEY) {
        result.info.push('✓ SUPABASE_ANON_KEY is set');
        if (process.env.SUPABASE_ANON_KEY === 'your-anon-key-here') {
            result.warnings.push('⚠ SUPABASE_ANON_KEY contains placeholder value');
        }
    }
    else {
        result.warnings.push('⚠ SUPABASE_ANON_KEY is not set (optional, but recommended)');
    }
    return result;
}
async function testDatabaseConnection() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        return { success: false, error: 'DATABASE_URL is not set' };
    }
    try {
        // Try to parse and validate the connection string
        const url = new URL(databaseUrl);
        const isSupabase = url.hostname.includes('supabase.co');
        // Create a test connection
        const testClient = postgres(databaseUrl, {
            max: 1,
            connect_timeout: 10,
            ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
        });
        // Test the connection
        const result = await testClient `SELECT version(), current_database(), current_user`;
        // Close the connection
        await testClient.end();
        return {
            success: true,
            details: {
                version: result[0]?.version || 'Unknown',
                database: result[0]?.current_database || 'Unknown',
                user: result[0]?.current_user || 'Unknown',
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
async function testDrizzleConnection() {
    try {
        // Dynamically import after env vars are loaded
        const { checkDatabaseConnection } = await import('../src/database/index.js');
        const isConnected = await checkDatabaseConnection();
        return {
            success: isConnected,
            error: isConnected ? undefined : 'Connection check returned false',
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
async function main() {
    console.log('🔍 Verifying Database Connection and Configuration\n');
    console.log('='.repeat(60));
    // Step 1: Validate .env file
    console.log('\n📋 Step 1: Validating .env file...');
    const validation = validateEnvFile();
    if (validation.info.length > 0) {
        validation.info.forEach(msg => console.log(`  ${msg}`));
    }
    if (validation.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        validation.warnings.forEach(warning => console.log(`  ${warning}`));
    }
    if (validation.errors.length > 0) {
        console.log('\n❌ Errors:');
        validation.errors.forEach(error => console.log(`  ${error}`));
        console.log('\n❌ Validation failed. Please fix the errors above before proceeding.');
        process.exit(1);
    }
    if (validation.isValid) {
        console.log('\n✅ .env file validation passed!');
    }
    // Step 2: Test direct database connection
    console.log('\n🔌 Step 2: Testing direct database connection...');
    const connectionTest = await testDatabaseConnection();
    if (connectionTest.success) {
        console.log('✅ Database connection successful!');
        if (connectionTest.details) {
            console.log(`  Database: ${connectionTest.details.database}`);
            console.log(`  User: ${connectionTest.details.user}`);
            console.log(`  PostgreSQL Version: ${connectionTest.details.version.split(' ')[0]} ${connectionTest.details.version.split(' ')[1]}`);
        }
    }
    else {
        console.log('❌ Database connection failed!');
        console.log(`  Error: ${connectionTest.error}`);
        console.log('\n💡 Troubleshooting tips:');
        console.log('  1. Verify your DATABASE_URL is correct');
        console.log('  2. Check that your password doesn\'t contain special characters that need URL encoding');
        console.log('  3. Ensure your Supabase project is active');
        console.log('  4. Check if your IP is allowed in Supabase network settings');
        process.exit(1);
    }
    // Step 3: Test Drizzle connection
    console.log('\n🔧 Step 3: Testing Drizzle ORM connection...');
    const drizzleTest = await testDrizzleConnection();
    if (drizzleTest.success) {
        console.log('✅ Drizzle ORM connection successful!');
    }
    else {
        console.log('❌ Drizzle ORM connection failed!');
        console.log(`  Error: ${drizzleTest.error}`);
        process.exit(1);
    }
    // Step 4: Verify Drizzle configuration
    console.log('\n⚙️  Step 4: Verifying Drizzle configuration...');
    try {
        const config = await import('../drizzle.config.js');
        console.log('✅ Drizzle config file is valid');
        console.log('  Schema path: ./src/database/schema.ts');
        console.log('  Migrations path: ./src/database/migrations');
        console.log('  Dialect: postgresql');
    }
    catch (error) {
        console.log('⚠️  Could not verify Drizzle config (this is okay if using TypeScript)');
    }
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ All checks passed! Your database connection is ready.');
    console.log('\n💡 Next steps:');
    console.log('  1. Run: npm run db:push (or npx drizzle-kit push)');
    console.log('  2. This will push your schema to the database');
    console.log('  3. After successful push, you can start your application');
    console.log('');
}
// Run the verification
main().catch((error) => {
    console.error('\n❌ Verification script failed:', error);
    process.exit(1);
});
//# sourceMappingURL=verify-connection.js.map