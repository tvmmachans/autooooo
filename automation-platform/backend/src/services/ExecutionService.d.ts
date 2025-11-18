export declare class ExecutionService {
    executeWorkflow(workflowId: number, input: any, userId: number): Promise<{
        executionId: any;
        success: boolean;
        data: Record<string, any> | undefined;
        error: string | undefined;
    } | {
        executionId: any;
        success: boolean;
        error: string;
        data?: never;
    }>;
    bulkInsertLogs(executionId: number, logs: Array<{
        level: 'info' | 'warn' | 'error';
        message: string;
        data?: Record<string, any>;
        nodeId?: string;
    }>): Promise<{
        timestamp: Date;
        id: number;
        data: Record<string, any> | null;
        executionId: number;
        level: string;
        message: string;
    }[]>;
    updateExecutionProgress(executionId: number, progressUpdate: Partial<{
        currentNode?: string;
        completedNodes: string[];
        totalNodes: number;
        percentage: number;
        nodeProgress: Record<string, {
            status: string;
            startedAt?: string;
            completedAt?: string;
        }>;
    }>): Promise<any>;
    getExecutionStatus(executionId: number): Promise<{
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
        } | undefined;
        logs: {
            id: number;
            level: string;
            message: string;
            data: Record<string, any> | null;
            timestamp: Date;
            nodeId: any;
        }[];
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
    }>;
    searchExecutionHistory(workflowId: number, filters?: {
        status?: string[];
        dateFrom?: Date;
        dateTo?: Date;
        nodeId?: string;
        inputData?: Record<string, any>;
        outputData?: Record<string, any>;
        page?: number;
        limit?: number;
        sortBy?: 'createdAt' | 'startedAt' | 'completedAt';
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        executions: {
            id: number;
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
        }[];
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
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
    bulkDeleteExecutions(executionIds: number[], userId: number): Promise<{
        deletedCount: number;
    }>;
    updateExecutionState(executionId: number, stateUpdate: Record<string, any>): Promise<{
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
    }[] | null>;
    getExecutionLogsAdvanced(executionId: number, filters?: {
        level?: string[];
        nodeId?: string;
        dateFrom?: Date;
        dateTo?: Date;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        logs: {
            id: number;
            executionId: number;
            level: string;
            message: string;
            data: Record<string, any> | null;
            timestamp: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getExecutionMetrics(workflowId: number, timeRange: {
        from: Date;
        to: Date;
    }): Promise<{
        totalExecutions: number;
        successfulExecutions: number;
        failedExecutions: number;
        runningExecutions: number;
        avgExecutionTime: number;
        minExecutionTime: number;
        maxExecutionTime: number;
    } | undefined>;
    getActiveExecutionsWithDetails(limit?: number): Promise<{
        execution: {
            id: number;
            status: string;
            startedAt: Date | null;
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
        };
        recentLogs: any;
    }[]>;
    cleanupOldExecutions(olderThanDays: number, userId: number): Promise<{
        deletedCount: any;
    }>;
}
export declare const executionService: ExecutionService;
//# sourceMappingURL=ExecutionService.d.ts.map