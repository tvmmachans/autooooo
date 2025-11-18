import type { WorkflowExecutionContext } from '../../database/schema.js';
export declare class ThumbnailAINode {
    private aiService;
    constructor();
    execute(context: WorkflowExecutionContext, input: Record<string, any>): Promise<{
        success: boolean;
        output?: Record<string, any>;
        error?: string;
    }>;
    private generateThumbnailPrompt;
    private extractThumbnail;
    private addTextOverlay;
}
//# sourceMappingURL=ThumbnailAINode.d.ts.map