import type { WorkflowExecutionContext } from '../../database/schema.js';
export declare class AITTSNode {
    private ttsService;
    constructor();
    execute(context: WorkflowExecutionContext, input: Record<string, any>): Promise<{
        success: boolean;
        output?: Record<string, any>;
        error?: string;
    }>;
}
//# sourceMappingURL=AITTSNode.d.ts.map