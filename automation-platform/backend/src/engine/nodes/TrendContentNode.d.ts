import type { WorkflowExecutionContext } from '../../database/schema.js';
export declare class TrendContentNode {
    private aiService;
    constructor();
    execute(context: WorkflowExecutionContext, input: Record<string, any>): Promise<{
        success: boolean;
        output?: Record<string, any>;
        error?: string;
    }>;
    private getTrendingTopics;
    private fetchTrendsFromAPI;
}
//# sourceMappingURL=TrendContentNode.d.ts.map