import { z } from 'zod';
import { Node, Edge } from '../../types/database.js';
export declare enum NodeType {
    START = "start",
    ACTION = "action",
    CONDITION = "condition",
    END = "end"
}
export interface ActionNodeConfig {
    actionType: 'http' | 'delay' | 'setVariable' | 'log';
    httpConfig?: {
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
        url: string;
        headers?: Record<string, string>;
        body?: any;
        timeout?: number;
    };
    delayConfig?: {
        duration: number;
    };
    variableConfig?: {
        variableName: string;
        variableValue: any;
    };
    logConfig?: {
        level: 'info' | 'warn' | 'error';
        message: string;
    };
}
export interface ConditionNodeConfig {
    conditions: Condition[];
    logicOperator: 'AND' | 'OR';
}
export interface Condition {
    type: 'value' | 'expression' | 'custom';
    left: string;
    operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains' | 'matches';
    right: any;
    expression?: string;
    customLogic?: string;
}
export interface StartNodeConfig {
    variables?: Record<string, any>;
    trigger?: 'manual' | 'webhook' | 'schedule';
}
export interface EndNodeConfig {
    outputMapping?: Record<string, string>;
    successMessage?: string;
}
export type NodeConfig = ActionNodeConfig | ConditionNodeConfig | StartNodeConfig | EndNodeConfig;
export interface WorkflowNode extends Omit<Node, 'type'> {
    type: NodeType;
    config: NodeConfig;
    validationErrors?: string[];
}
export interface ConnectionRule {
    sourceType: NodeType;
    targetType: NodeType;
    maxConnections?: number;
    condition?: (sourceNode: WorkflowNode, targetNode: WorkflowNode) => boolean;
}
export declare const CONNECTION_RULES: ConnectionRule[];
export declare const validateNodeConfig: (node: WorkflowNode) => string[];
export declare const validateConnection: (sourceNode: WorkflowNode, targetNode: WorkflowNode, existingConnections: Edge[]) => {
    valid: boolean;
    error?: string;
};
export declare const ActionNodeConfigSchema: z.ZodObject<{
    actionType: z.ZodEnum<{
        log: "log";
        delay: "delay";
        http: "http";
        setVariable: "setVariable";
    }>;
    httpConfig: z.ZodOptional<z.ZodObject<{
        method: z.ZodEnum<{
            GET: "GET";
            POST: "POST";
            PUT: "PUT";
            DELETE: "DELETE";
            PATCH: "PATCH";
        }>;
        url: z.ZodString;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.core.SomeType>>;
        body: z.ZodOptional<z.ZodAny>;
        timeout: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    delayConfig: z.ZodOptional<z.ZodObject<{
        duration: z.ZodNumber;
    }, z.core.$strip>>;
    variableConfig: z.ZodOptional<z.ZodObject<{
        variableName: z.ZodString;
        variableValue: z.ZodAny;
    }, z.core.$strip>>;
    logConfig: z.ZodOptional<z.ZodObject<{
        level: z.ZodEnum<{
            error: "error";
            info: "info";
            warn: "warn";
        }>;
        message: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const ConditionSchema: z.ZodObject<{
    type: z.ZodEnum<{
        custom: "custom";
        value: "value";
        expression: "expression";
    }>;
    left: z.ZodString;
    operator: z.ZodEnum<{
        equals: "equals";
        contains: "contains";
        notEquals: "notEquals";
        greaterThan: "greaterThan";
        lessThan: "lessThan";
        matches: "matches";
    }>;
    right: z.ZodAny;
    expression: z.ZodOptional<z.ZodString>;
    customLogic: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const ConditionNodeConfigSchema: z.ZodObject<{
    conditions: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<{
            custom: "custom";
            value: "value";
            expression: "expression";
        }>;
        left: z.ZodString;
        operator: z.ZodEnum<{
            equals: "equals";
            contains: "contains";
            notEquals: "notEquals";
            greaterThan: "greaterThan";
            lessThan: "lessThan";
            matches: "matches";
        }>;
        right: z.ZodAny;
        expression: z.ZodOptional<z.ZodString>;
        customLogic: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    logicOperator: z.ZodEnum<{
        AND: "AND";
        OR: "OR";
    }>;
}, z.core.$strip>;
export declare const StartNodeConfigSchema: z.ZodObject<{
    variables: z.ZodOptional<z.ZodRecord<z.ZodAny, z.core.SomeType>>;
    trigger: z.ZodOptional<z.ZodEnum<{
        manual: "manual";
        webhook: "webhook";
        schedule: "schedule";
    }>>;
}, z.core.$strip>;
export declare const EndNodeConfigSchema: z.ZodObject<{
    outputMapping: z.ZodOptional<z.ZodRecord<z.ZodString, z.core.SomeType>>;
    successMessage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const WorkflowNodeSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    position: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>;
    data: z.ZodRecord<z.ZodAny, z.core.SomeType>;
    config: z.ZodUnion<readonly [z.ZodObject<{
        actionType: z.ZodEnum<{
            log: "log";
            delay: "delay";
            http: "http";
            setVariable: "setVariable";
        }>;
        httpConfig: z.ZodOptional<z.ZodObject<{
            method: z.ZodEnum<{
                GET: "GET";
                POST: "POST";
                PUT: "PUT";
                DELETE: "DELETE";
                PATCH: "PATCH";
            }>;
            url: z.ZodString;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.core.SomeType>>;
            body: z.ZodOptional<z.ZodAny>;
            timeout: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        delayConfig: z.ZodOptional<z.ZodObject<{
            duration: z.ZodNumber;
        }, z.core.$strip>>;
        variableConfig: z.ZodOptional<z.ZodObject<{
            variableName: z.ZodString;
            variableValue: z.ZodAny;
        }, z.core.$strip>>;
        logConfig: z.ZodOptional<z.ZodObject<{
            level: z.ZodEnum<{
                error: "error";
                info: "info";
                warn: "warn";
            }>;
            message: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        conditions: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<{
                custom: "custom";
                value: "value";
                expression: "expression";
            }>;
            left: z.ZodString;
            operator: z.ZodEnum<{
                equals: "equals";
                contains: "contains";
                notEquals: "notEquals";
                greaterThan: "greaterThan";
                lessThan: "lessThan";
                matches: "matches";
            }>;
            right: z.ZodAny;
            expression: z.ZodOptional<z.ZodString>;
            customLogic: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        logicOperator: z.ZodEnum<{
            AND: "AND";
            OR: "OR";
        }>;
    }, z.core.$strip>, z.ZodObject<{
        variables: z.ZodOptional<z.ZodRecord<z.ZodAny, z.core.SomeType>>;
        trigger: z.ZodOptional<z.ZodEnum<{
            manual: "manual";
            webhook: "webhook";
            schedule: "schedule";
        }>>;
    }, z.core.$strip>, z.ZodObject<{
        outputMapping: z.ZodOptional<z.ZodRecord<z.ZodString, z.core.SomeType>>;
        successMessage: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>]>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    selected: z.ZodOptional<z.ZodBoolean>;
    dragging: z.ZodOptional<z.ZodBoolean>;
    label: z.ZodOptional<z.ZodString>;
    style: z.ZodOptional<z.ZodRecord<z.ZodAny, z.core.SomeType>>;
    validationErrors: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const isActionNode: (node: WorkflowNode) => node is WorkflowNode & {
    config: ActionNodeConfig;
};
export declare const isConditionNode: (node: WorkflowNode) => node is WorkflowNode & {
    config: ConditionNodeConfig;
};
export declare const isStartNode: (node: WorkflowNode) => node is WorkflowNode & {
    config: StartNodeConfig;
};
export declare const isEndNode: (node: WorkflowNode) => node is WorkflowNode & {
    config: EndNodeConfig;
};
export declare const createNode: (type: NodeType, position: {
    x: number;
    y: number;
}, config: NodeConfig) => WorkflowNode;
export declare const getNodeTypeLabel: (type: NodeType) => string;
//# sourceMappingURL=types.d.ts.map