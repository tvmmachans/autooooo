import type { WorkflowExecutionContext } from '../../database/schema.js';
export declare class CompetitorTrendNode {
    execute(context: WorkflowExecutionContext, input: Record<string, any>): Promise<{
        success: boolean;
        output?: Record<string, any>;
        error?: string;
    }>;
    private trackCompetitor;
}
//# sourceMappingURL=CompetitorTrendNode.d.ts.map