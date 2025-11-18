import React from 'react';
import { type NodeProps } from 'reactflow';
import type { WorkflowNode } from './types.js';
interface BaseNodeProps extends NodeProps {
    data: WorkflowNode;
}
export declare const nodeTypes: {
    start: React.NamedExoticComponent<BaseNodeProps>;
    action: React.NamedExoticComponent<BaseNodeProps>;
    condition: React.NamedExoticComponent<BaseNodeProps>;
    end: React.NamedExoticComponent<BaseNodeProps>;
};
interface ConfigurationFormProps<T> {
    config: T;
    onChange: (config: T) => void;
    errors?: string[];
}
export declare const ActionNodeConfigForm: React.FC<ConfigurationFormProps<any>>;
export declare const ConditionNodeConfigForm: React.FC<ConfigurationFormProps<any>>;
export declare const StartNodeConfigForm: React.FC<ConfigurationFormProps<any>>;
export declare const EndNodeConfigForm: React.FC<ConfigurationFormProps<any>>;
export {};
//# sourceMappingURL=NodeTypes.d.ts.map