import type { WorkflowExecutionContext } from '../../database/schema.js';
export declare class AIReelScriptNode {
    private aiService;
    constructor();
    execute(context: WorkflowExecutionContext, input: Record<string, any>): Promise<{
        success: boolean;
        output?: Record<string, any>;
        error?: string;
    }>;
    private parseReelScript;
}
//# sourceMappingURL=AIReelScriptNode.d.ts.map