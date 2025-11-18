import postgres from 'postgres';
import * as schema from './schema.js';
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
};
export type Database = typeof db;
export * from './schema.js';
export declare class DatabaseUtils {
    private db;
    constructor(db: Database);
    getUserById(id: number): Promise<{
        id: number;
        email: string;
        password: string;
        name: string;
        isActive: boolean;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getUserByEmail(email: string): Promise<{
        id: number;
        email: string;
        password: string;
        name: string;
        isActive: boolean;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getActiveUsers(): Promise<{
        id: number;
        email: string;
        password: string;
        name: string;
        isActive: boolean;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getWorkflowsByUserId(userId: number, activeOnly?: boolean): Promise<{
        id: number;
        name: string;
        description: string | null;
        userId: number;
        nodes: schema.Node[];
        edges: schema.Edge[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getWorkflowById(id: number): Promise<{
        id: number;
        name: string;
        description: string | null;
        userId: number;
        nodes: schema.Node[];
        edges: schema.Edge[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    searchWorkflows(userId: number, searchTerm: string): Promise<{
        id: number;
        name: string;
        description: string | null;
        userId: number;
        nodes: schema.Node[];
        edges: schema.Edge[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getExecutionsByWorkflowId(workflowId: number, limit?: number): Promise<{
        id: number;
        workflowId: number;
        status: string;
        startedAt: Date | null;
        completedAt: Date | null;
        error: string | null;
        inputData: Record<string, any> | null;
        outputData: Record<string, any> | null;
        progress: {
            currentNode?: string;
            completedNodes: string[];
            totalNodes: number;
            percentage: number;
            nodeProgress: Record<string, {
                status: string;
                startedAt?: string;
                completedAt?: string;
            }>;
        } | null;
        createdAt: Date;
    }[]>;
    getExecutionById(id: number): Promise<{
        id: number;
        workflowId: number;
        status: string;
        startedAt: Date | null;
        completedAt: Date | null;
        error: string | null;
        inputData: Record<string, any> | null;
        outputData: Record<string, any> | null;
        progress: {
            currentNode?: string;
            completedNodes: string[];
            totalNodes: number;
            percentage: number;
            nodeProgress: Record<string, {
                status: string;
                startedAt?: string;
                completedAt?: string;
            }>;
        } | null;
        createdAt: Date;
    }[]>;
    getExecutionsByStatus(status: string, limit?: number): Promise<{
        id: number;
        workflowId: number;
        status: string;
        startedAt: Date | null;
        completedAt: Date | null;
        error: string | null;
        inputData: Record<string, any> | null;
        outputData: Record<string, any> | null;
        progress: {
            currentNode?: string;
            completedNodes: string[];
            totalNodes: number;
            percentage: number;
            nodeProgress: Record<string, {
                status: string;
                startedAt?: string;
                completedAt?: string;
            }>;
        } | null;
        createdAt: Date;
    }[]>;
    getRecentExecutions(userId: number, days?: number): Promise<{
        execution: {
            id: number;
            workflowId: number;
            status: string;
            startedAt: Date | null;
            completedAt: Date | null;
            error: string | null;
            inputData: Record<string, any> | null;
            outputData: Record<string, any> | null;
            progress: {
                currentNode?: string;
                completedNodes: string[];
                totalNodes: number;
                percentage: number;
                nodeProgress: Record<string, {
                    status: string;
                    startedAt?: string;
                    completedAt?: string;
                }>;
            } | null;
            createdAt: Date;
        };
        workflow: {
            id: number;
            name: string;
            description: string | null;
            userId: number;
            nodes: schema.Node[];
            edges: schema.Edge[];
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }[]>;
    getExecutionLogs(executionId: number, limit?: number): Promise<{
        id: number;
        executionId: number;
        level: string;
        message: string;
        data: Record<string, any> | null;
        timestamp: Date;
    }[]>;
    findWorkflowsByNodeType(userId: number, nodeType: string): Promise<{
        id: number;
        name: string;
        description: string | null;
        userId: number;
        nodes: schema.Node[];
        edges: schema.Edge[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    searchExecutionHistory(workflowId: number, conditions: Record<string, any>, limit?: number): Promise<{
        id: number;
        workflowId: number;
        status: string;
        startedAt: Date | null;
        completedAt: Date | null;
        error: string | null;
        inputData: Record<string, any> | null;
        outputData: Record<string, any> | null;
        progress: {
            currentNode?: string;
            completedNodes: string[];
            totalNodes: number;
            percentage: number;
            nodeProgress: Record<string, {
                status: string;
                startedAt?: string;
                completedAt?: string;
            }>;
        } | null;
        createdAt: Date;
    }[]>;
    bulkInsertExecutionLogs(logs: schema.NewExecutionLog[]): Promise<{
        timestamp: Date;
        id: number;
        data: Record<string, any> | null;
        executionId: number;
        level: string;
        message: string;
    }[]>;
    bulkUpdateExecutionStatus(executionIds: number[], status: string): Promise<{
        id: number;
        workflowId: number;
        status: string;
        startedAt: Date | null;
        completedAt: Date | null;
        error: string | null;
        inputData: Record<string, any> | null;
        outputData: Record<string, any> | null;
        progress: {
            currentNode?: string;
            completedNodes: string[];
            totalNodes: number;
            percentage: number;
            nodeProgress: Record<string, {
                status: string;
                startedAt?: string;
                completedAt?: string;
            }>;
        } | null;
        createdAt: Date;
    }[]>;
    loadWorkflowWithNodes(workflowId: number): Promise<{
        id: number;
        name: string;
        nodes: schema.Node[];
        edges: schema.Edge[];
        userId: number;
    }[]>;
    getActiveExecutions(limit?: number): Promise<{
        execution: {
            id: number;
            workflowId: number;
            status: string;
            startedAt: Date | null;
            completedAt: Date | null;
            error: string | null;
            inputData: Record<string, any> | null;
            outputData: Record<string, any> | null;
            progress: {
                currentNode?: string;
                completedNodes: string[];
                totalNodes: number;
                percentage: number;
                nodeProgress: Record<string, {
                    status: string;
                    startedAt?: string;
                    completedAt?: string;
                }>;
            } | null;
            createdAt: Date;
        };
        workflow: {
            id: number;
            name: string;
            description: string | null;
            userId: number;
            nodes: schema.Node[];
            edges: schema.Edge[];
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }[]>;
    getExecutionContext(executionId: number): Promise<{
        execution: {
            id: number;
            workflowId: number;
            status: string;
            startedAt: Date | null;
            completedAt: Date | null;
            error: string | null;
            inputData: Record<string, any> | null;
            outputData: Record<string, any> | null;
            progress: {
                currentNode?: string;
                completedNodes: string[];
                totalNodes: number;
                percentage: number;
                nodeProgress: Record<string, {
                    status: string;
                    startedAt?: string;
                    completedAt?: string;
                }>;
            } | null;
            createdAt: Date;
        };
        workflow: {
            id: number;
            name: string;
            description: string | null;
            userId: number;
            nodes: schema.Node[];
            edges: schema.Edge[];
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } | undefined>;
    getLogsByLevel(level: string, limit?: number): Promise<{
        log: {
            id: number;
            executionId: number;
            level: string;
            message: string;
            data: Record<string, any> | null;
            timestamp: Date;
        };
        execution: {
            id: number;
            workflowId: number;
            status: string;
            startedAt: Date | null;
            completedAt: Date | null;
            error: string | null;
            inputData: Record<string, any> | null;
            outputData: Record<string, any> | null;
            progress: {
                currentNode?: string;
                completedNodes: string[];
                totalNodes: number;
                percentage: number;
                nodeProgress: Record<string, {
                    status: string;
                    startedAt?: string;
                    completedAt?: string;
                }>;
            } | null;
            createdAt: Date;
        };
        workflow: {
            id: number;
            name: string;
            description: string | null;
            userId: number;
            nodes: schema.Node[];
            edges: schema.Edge[];
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }[]>;
    getCredentialsByUserId(userId: number): Promise<{
        id: number;
        userId: number;
        name: string;
        type: string;
        data: schema.EncryptedCredentialData;
        isEncrypted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getCredentialById(id: number): Promise<{
        id: number;
        userId: number;
        name: string;
        type: string;
        data: schema.EncryptedCredentialData;
        isEncrypted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getCredentialsByType(userId: number, type: string): Promise<{
        id: number;
        userId: number;
        name: string;
        type: string;
        data: schema.EncryptedCredentialData;
        isEncrypted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getWebhooksByUserId(userId: number, activeOnly?: boolean): Promise<{
        id: number;
        userId: number;
        workflowId: number | null;
        url: string;
        secret: string;
        events: string[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getWebhookById(id: number): Promise<{
        id: number;
        userId: number;
        workflowId: number | null;
        url: string;
        secret: string;
        events: string[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getWebhooksByWorkflowId(workflowId: number): Promise<{
        id: number;
        userId: number;
        workflowId: number | null;
        url: string;
        secret: string;
        events: string[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getWorkflowStats(userId: number): Promise<{
        totalWorkflows: number;
        activeWorkflows: number;
    } | undefined>;
    getExecutionStats(workflowId: number): Promise<{
        totalExecutions: number;
        successfulExecutions: number;
        failedExecutions: number;
        runningExecutions: number;
    } | undefined>;
    getSystemStats(): Promise<{
        users: {
            totalUsers: number;
            activeUsers: number;
        } | undefined;
        workflows: {
            totalWorkflows: number;
            activeWorkflows: number;
        } | undefined;
        executions: {
            totalExecutions: number;
            completedExecutions: number;
            failedExecutions: number;
        } | undefined;
    }>;
}
export declare const dbUtils: DatabaseUtils;
export declare function withTransaction<T>(callback: (tx: any) => Promise<T>): Promise<T>;
export declare function checkDatabaseConnection(): Promise<boolean>;
//# sourceMappingURL=index.d.ts.map