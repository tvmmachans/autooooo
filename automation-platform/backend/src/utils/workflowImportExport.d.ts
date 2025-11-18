import type { Workflow } from '../database/schema.js';
import { z } from 'zod';
declare const workflowExportSchema: z.ZodObject<{
    version: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    nodes: z.ZodArray<z.ZodAny, "many">;
    edges: z.ZodArray<z.ZodAny, "many">;
    variables: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    version: string;
    nodes: any[];
    edges: any[];
    description?: string | undefined;
    metadata?: Record<string, any> | undefined;
    variables?: Record<string, any> | undefined;
}, {
    name: string;
    version: string;
    nodes: any[];
    edges: any[];
    description?: string | undefined;
    metadata?: Record<string, any> | undefined;
    variables?: Record<string, any> | undefined;
}>;
export type WorkflowExport = z.infer<typeof workflowExportSchema>;
export declare class WorkflowImportExport {
    /**
     * Export workflow to JSON
     */
    static exportWorkflow(workflow: Workflow): WorkflowExport;
    /**
     * Import workflow from JSON
     */
    static importWorkflow(data: unknown, userId: number, options?: {
        validate?: boolean;
        updateName?: boolean;
    }): {
        name: string;
        description?: string;
        nodes: any[];
        edges: any[];
        variables?: Record<string, any>;
        errors?: string[];
    };
    /**
     * Validate workflow structure
     */
    static validateWorkflow(workflow: {
        nodes: any[];
        edges: any[];
    }): {
        valid: boolean;
        errors: string[];
    };
}
export {};
//# sourceMappingURL=workflowImportExport.d.ts.map