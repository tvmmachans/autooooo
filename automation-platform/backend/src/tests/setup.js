// Test setup file
import dotenv from 'dotenv';
// Load test environment variables
dotenv.config({ path: '.env.test' });
// Mock database connection for tests
jest.mock('../database/index', () => ({
    db: {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    dbUtils: {
        getUserById: jest.fn(),
        getWorkflowById: jest.fn(),
    },
}));
// Global test timeout
jest.setTimeout(10000);
//# sourceMappingURL=setup.js.map