import type { WorkflowExecutionContext } from '../../database/schema.js';
export declare class TrendAnalyzerNode {
    private analysisService;
    constructor();
    execute(context: WorkflowExecutionContext, input: Record<string, any>): Promise<{
        success: boolean;
        output?: Record<string, any>;
        error?: string;
    }>;
    private generateInsights;
    private getTopCategory;
}
//# sourceMappingURL=TrendAnalyzerNode.d.ts.map