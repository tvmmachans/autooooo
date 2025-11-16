import { BaseNode } from './BaseNode.js';
import type { NodeExecutionResult } from './BaseNode.js';
export declare class EndNode extends BaseNode {
    execute(input: Record<string, any>): Promise<NodeExecutionResult>;
    private performCleanup;
}
//# sourceMappingURL=EndNode.d.ts.map