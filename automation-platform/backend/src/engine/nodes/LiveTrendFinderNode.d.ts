import type { WorkflowExecutionContext } from '../../database/schema.js';
export declare class LiveTrendFinderNode {
    private googleTrends;
    private youtubeTrends;
    private instagramTrends;
    private twitterTrends;
    private tiktokTrends;
    private regionalTrends;
    constructor();
    execute(context: WorkflowExecutionContext, input: Record<string, any>): Promise<{
        success: boolean;
        output?: Record<string, any>;
        error?: string;
    }>;
    private saveTrends;
}
//# sourceMappingURL=LiveTrendFinderNode.d.ts.map