import type { WorkflowExecutionContext } from '../../database/schema.js';
export declare class AIVideoNode {
    private videoService;
    private stockMediaService;
    private subtitleService;
    private aiService;
    private ttsService;
    constructor();
    execute(context: WorkflowExecutionContext, input: Record<string, any>): Promise<{
        success: boolean;
        output?: Record<string, any>;
        error?: string;
    }>;
    private extractKeywords;
    private getResolution;
}
//# sourceMappingURL=AIVideoNode.d.ts.map