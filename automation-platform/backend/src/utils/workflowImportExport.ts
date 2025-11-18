import type { Workflow } from '../database/schema.js';
import { z } from 'zod';

// Workflow export schema
const workflowExportSchema = z.object({
  version: z.string(),
  name: z.string(),
  description: z.string().optional(),
  nodes: z.array(z.any()),
  edges: z.array(z.any()),
  variables: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
});

export type WorkflowExport = z.infer<typeof workflowExportSchema>;

export class WorkflowImportExport {
  /**
   * Export workflow to JSON
   */
  static exportWorkflow(workflow: Workflow): WorkflowExport {
    return {
      version: '1.0.0',
      name: workflow.name,
      description: workflow.description || undefined,
      nodes: workflow.nodes as any[],
      edges: workflow.edges as any[],
      metadata: {
        exportedAt: new Date().toISOString(),
        workflowId: workflow.id,
      },
    };
  }

  /**
   * Import workflow from JSON
   */
  static importWorkflow(
    data: unknown,
    userId: number,
    options: {
      validate?: boolean;
      updateName?: boolean;
    } = {}
  ): {
    name: string;
    description?: string;
    nodes: any[];
    edges: any[];
    variables?: Record<string, any>;
    errors?: string[];
  } {
    const { validate = true, updateName = true } = options;

    // Validate schema if requested
    if (validate) {
      const result = workflowExportSchema.safeParse(data);
      if (!result.success) {
        throw new Error(`Invalid workflow format: ${result.error.message}`);
      }
      data = result.data;
    }

    const workflow = data as WorkflowExport;
    const errors: string[] = [];

    // Validate nodes
    if (!Array.isArray(workflow.nodes) || workflow.nodes.length === 0) {
      errors.push('Workflow must have at least one node');
    }

    // Validate edges
    if (!Array.isArray(workflow.edges)) {
      errors.push('Workflow must have edges array');
    }

    // Check for required node types
    const nodeTypes = workflow.nodes.map((n: any) => n.type);
    if (!nodeTypes.includes('start')) {
      errors.push('Workflow must have a start node');
    }

    // Version compatibility check
    if (workflow.version !== '1.0.0') {
      errors.push(`Version ${workflow.version} may not be compatible`);
    }

    if (errors.length > 0 && validate) {
      throw new Error(`Import validation failed: ${errors.join(', ')}`);
    }

    return {
      name: updateName ? `${workflow.name} (Imported)` : workflow.name,
      ...(workflow.description !== undefined && { description: workflow.description }),
      nodes: workflow.nodes,
      edges: workflow.edges,
      ...(workflow.variables !== undefined && { variables: workflow.variables }),
      ...(errors.length > 0 ? { errors } : {}),
    };
  }

  /**
   * Validate workflow structure
   */
  static validateWorkflow(workflow: {
    nodes: any[];
    edges: any[];
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check nodes
    if (!Array.isArray(workflow.nodes)) {
      errors.push('Nodes must be an array');
      return { valid: false, errors };
    }

    if (workflow.nodes.length === 0) {
      errors.push('Workflow must have at least one node');
    }

    // Check for start node
    const hasStart = workflow.nodes.some((n: any) => n.type === 'start');
    if (!hasStart) {
      errors.push('Workflow must have a start node');
    }

    // Check edges
    if (!Array.isArray(workflow.edges)) {
      errors.push('Edges must be an array');
    } else {
      // Validate edge references
      const nodeIds = new Set(workflow.nodes.map((n: any) => n.id));
      for (const edge of workflow.edges) {
        if (!nodeIds.has(edge.source)) {
          errors.push(`Edge references unknown source node: ${edge.source}`);
        }
        if (!nodeIds.has(edge.target)) {
          errors.push(`Edge references unknown target node: ${edge.target}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

