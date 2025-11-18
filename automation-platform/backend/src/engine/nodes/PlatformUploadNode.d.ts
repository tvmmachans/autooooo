import type { WorkflowExecutionContext } from '../../database/schema.js';
export declare class PlatformUploadNode {
    private uploadService;
    constructor();
    execute(context: WorkflowExecutionContext, input: Record<string, any>): Promise<{
        success: boolean;
        output?: Record<string, any>;
        error?: string;
    }>;
}
//# sourceMappingURL=PlatformUploadNode.d.ts.map