import type { WorkflowExecutionContext } from '../../database/schema.js';
export declare class AIContentNode {
    private aiService;
    constructor();
    execute(context: WorkflowExecutionContext, input: Record<string, any>): Promise<{
        success: boolean;
        output?: Record<string, any>;
        error?: string;
    }>;
}
//# sourceMappingURL=AIContentNode.d.ts.map