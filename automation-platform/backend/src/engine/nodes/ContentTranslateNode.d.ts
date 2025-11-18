import type { WorkflowExecutionContext } from '../../database/schema.js';
export declare class ContentTranslateNode {
    private aiService;
    constructor();
    execute(context: WorkflowExecutionContext, input: Record<string, any>): Promise<{
        success: boolean;
        output?: Record<string, any>;
        error?: string;
    }>;
    private selectTranslationModel;
}
//# sourceMappingURL=ContentTranslateNode.d.ts.map