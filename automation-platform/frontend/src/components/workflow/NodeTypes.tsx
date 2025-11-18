import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { WorkflowNode } from './types.js';
import { NodeType } from './types.js';
import { isActionNode, isConditionNode, isStartNode, isEndNode } from './types.js';

// Base node component props
interface BaseNodeProps extends NodeProps {
  data: WorkflowNode;
}

// Action Node Component
const ActionNodeComponent: React.FC<BaseNodeProps> = ({ data, selected }) => {
  if (!isActionNode(data)) return null;

  const config = data.config;
  const hasErrors = data.validationErrors && data.validationErrors.length > 0;

  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-blue-500' : 'border-stone-400'} ${hasErrors ? 'border-red-500' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />

      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold text-blue-600">Action</div>
          <div className="text-sm text-gray-600 capitalize">{config.actionType}</div>
        </div>
      </div>

      {hasErrors && (
        <div className="mt-2 text-xs text-red-600">
          {data.validationErrors!.map((error, idx) => (
            <div key={idx}>• {error}</div>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
    </div>
  );
};

// Condition Node Component
const ConditionNodeComponent: React.FC<BaseNodeProps> = ({ data, selected }) => {
  if (!isConditionNode(data)) return null;

  const config = data.config;
  const hasErrors = data.validationErrors && data.validationErrors.length > 0;

  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-green-500' : 'border-stone-400'} ${hasErrors ? 'border-red-500' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-green-500" />

      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold text-green-600">Condition</div>
          <div className="text-sm text-gray-600">{config.conditions.length} condition(s)</div>
          <div className="text-xs text-gray-500">{config.logicOperator}</div>
        </div>
      </div>

      {hasErrors && (
        <div className="mt-2 text-xs text-red-600">
          {data.validationErrors!.map((error, idx) => (
            <div key={idx}>• {error}</div>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} id="true" className="w-3 h-3 bg-green-500" />
      <Handle type="source" position={Position.Right} id="false" className="w-3 h-3 bg-red-500" />
    </div>
  );
};

// Start Node Component
const StartNodeComponent: React.FC<BaseNodeProps> = ({ data, selected }) => {
  if (!isStartNode(data)) return null;

  const config = data.config;
  const hasErrors = data.validationErrors && data.validationErrors.length > 0;

  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-purple-500' : 'border-stone-400'} ${hasErrors ? 'border-red-500' : ''}`}>
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold text-purple-600">Start</div>
          {config.trigger && (
            <div className="text-sm text-gray-600 capitalize">{config.trigger}</div>
          )}
        </div>
      </div>

      {hasErrors && (
        <div className="mt-2 text-xs text-red-600">
          {data.validationErrors!.map((error, idx) => (
            <div key={idx}>• {error}</div>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-500" />
    </div>
  );
};

// End Node Component
const EndNodeComponent: React.FC<BaseNodeProps> = ({ data, selected }) => {
  if (!isEndNode(data)) return null;

  const config = data.config;
  const hasErrors = data.validationErrors && data.validationErrors.length > 0;

  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-red-500' : 'border-stone-400'} ${hasErrors ? 'border-red-500' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-red-500" />

      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold text-red-600">End</div>
          {config.successMessage && (
            <div className="text-sm text-gray-600 truncate max-w-32">{config.successMessage}</div>
          )}
        </div>
      </div>

      {hasErrors && (
        <div className="mt-2 text-xs text-red-600">
          {data.validationErrors!.map((error, idx) => (
            <div key={idx}>• {error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// Node type mapping for React Flow
export const nodeTypes = {
  [NodeType.START]: memo(StartNodeComponent),
  [NodeType.ACTION]: memo(ActionNodeComponent),
  [NodeType.CONDITION]: memo(ConditionNodeComponent),
  [NodeType.END]: memo(EndNodeComponent),
};

// Configuration Form Components
interface ConfigurationFormProps<T> {
  config: T;
  onChange: (config: T) => void;
  errors?: string[];
}

export const ActionNodeConfigForm: React.FC<ConfigurationFormProps<any>> = ({ config, onChange, errors = [] }) => {
  const handleActionTypeChange = (actionType: string) => {
    onChange({ ...config, actionType });
  };

  const handleConfigChange = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Action Type</label>
        <select
          value={config.actionType || ''}
          onChange={(e) => handleActionTypeChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select action type</option>
          <option value="http">HTTP Request</option>
          <option value="delay">Delay</option>
          <option value="setVariable">Set Variable</option>
          <option value="log">Log Message</option>
        </select>
      </div>

      {config.actionType === 'http' && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Method</label>
            <select
              value={config.httpConfig?.method || 'GET'}
              onChange={(e) => handleConfigChange('httpConfig', { ...config.httpConfig, method: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              value={config.httpConfig?.url || ''}
              onChange={(e) => handleConfigChange('httpConfig', { ...config.httpConfig, url: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://api.example.com/endpoint"
            />
          </div>
        </div>
      )}

      {config.actionType === 'delay' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Duration (ms)</label>
          <input
            type="number"
            value={config.delayConfig?.duration || ''}
            onChange={(e) => handleConfigChange('delayConfig', { duration: parseInt(e.target.value) || 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
          />
        </div>
      )}

      {config.actionType === 'setVariable' && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Variable Name</label>
            <input
              type="text"
              value={config.variableConfig?.variableName || ''}
              onChange={(e) => handleConfigChange('variableConfig', { ...config.variableConfig, variableName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Variable Value</label>
            <textarea
              value={JSON.stringify(config.variableConfig?.variableValue || '', null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleConfigChange('variableConfig', { ...config.variableConfig, variableValue: parsed });
                } catch {
                  handleConfigChange('variableConfig', { ...config.variableConfig, variableValue: e.target.value });
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>
      )}

      {config.actionType === 'log' && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Log Level</label>
            <select
              value={config.logConfig?.level || 'info'}
              onChange={(e) => handleConfigChange('logConfig', { ...config.logConfig, level: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <input
              type="text"
              value={config.logConfig?.message || ''}
              onChange={(e) => handleConfigChange('logConfig', { ...config.logConfig, message: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="text-red-600 text-sm">
          {errors.map((error, idx) => (
            <div key={idx}>• {error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ConditionNodeConfigForm: React.FC<ConfigurationFormProps<any>> = ({ config, onChange, errors = [] }) => {
  const handleLogicOperatorChange = (logicOperator: string) => {
    onChange({ ...config, logicOperator });
  };

  const handleConditionChange = (index: number, condition: any) => {
    const newConditions = [...(config.conditions || [])];
    newConditions[index] = condition;
    onChange({ ...config, conditions: newConditions });
  };

  const addCondition = () => {
    const newConditions = [...(config.conditions || []), {
      type: 'value',
      left: '',
      operator: 'equals',
      right: '',
    }];
    onChange({ ...config, conditions: newConditions });
  };

  const removeCondition = (index: number) => {
    const newConditions = config.conditions.filter((_: any, i: number) => i !== index);
    onChange({ ...config, conditions: newConditions });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Logic Operator</label>
        <select
          value={config.logicOperator || 'AND'}
          onChange={(e) => handleLogicOperatorChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">Conditions</label>
          <button
            type="button"
            onClick={addCondition}
            className="text-green-600 hover:text-green-800 text-sm"
          >
            + Add Condition
          </button>
        </div>

        <div className="space-y-3 mt-2">
          {(config.conditions || []).map((condition: any, index: number) => (
            <div key={index} className="border rounded-md p-3 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium">Condition {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeCondition(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600">Left</label>
                  <input
                    type="text"
                    value={condition.left || ''}
                    onChange={(e) => handleConditionChange(index, { ...condition, left: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                    placeholder="variable.name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Operator</label>
                  <select
                    value={condition.operator || 'equals'}
                    onChange={(e) => handleConditionChange(index, { ...condition, operator: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                  >
                    <option value="equals">Equals</option>
                    <option value="notEquals">Not Equals</option>
                    <option value="greaterThan">Greater Than</option>
                    <option value="lessThan">Less Than</option>
                    <option value="contains">Contains</option>
                    <option value="matches">Matches</option>
                  </select>
                </div>
              </div>

              <div className="mt-2">
                <label className="block text-xs text-gray-600">Right Value</label>
                <input
                  type="text"
                  value={condition.right || ''}
                  onChange={(e) => handleConditionChange(index, { ...condition, right: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                  placeholder="comparison value"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {errors.length > 0 && (
        <div className="text-red-600 text-sm">
          {errors.map((error, idx) => (
            <div key={idx}>• {error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export const StartNodeConfigForm: React.FC<ConfigurationFormProps<any>> = ({ config, onChange, errors = [] }) => {
  const handleTriggerChange = (trigger: string) => {
    onChange({ ...config, trigger });
  };

  const handleVariablesChange = (variables: any) => {
    onChange({ ...config, variables });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Trigger Type</label>
        <select
          value={config.trigger || ''}
          onChange={(e) => handleTriggerChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="">Manual</option>
          <option value="webhook">Webhook</option>
          <option value="schedule">Schedule</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Initial Variables (JSON)</label>
        <textarea
          value={JSON.stringify(config.variables || {}, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handleVariablesChange(parsed);
            } catch {
              // Invalid JSON, keep as string for now
            }
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          rows={4}
          placeholder='{"key": "value"}'
        />
      </div>

      {errors.length > 0 && (
        <div className="text-red-600 text-sm">
          {errors.map((error, idx) => (
            <div key={idx}>• {error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export const EndNodeConfigForm: React.FC<ConfigurationFormProps<any>> = ({ config, onChange, errors = [] }) => {
  const handleOutputMappingChange = (outputMapping: any) => {
    onChange({ ...config, outputMapping });
  };

  const handleSuccessMessageChange = (successMessage: string) => {
    onChange({ ...config, successMessage });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Success Message</label>
        <input
          type="text"
          value={config.successMessage || ''}
          onChange={(e) => handleSuccessMessageChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          placeholder="Workflow completed successfully"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Output Mapping (JSON)</label>
        <textarea
          value={JSON.stringify(config.outputMapping || {}, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handleOutputMappingChange(parsed);
            } catch {
              // Invalid JSON, keep as string for now
            }
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          rows={4}
          placeholder='{"result": "variableName"}'
        />
      </div>

      {errors.length > 0 && (
        <div className="text-red-600 text-sm">
          {errors.map((error, idx) => (
            <div key={idx}>• {error}</div>
          ))}
        </div>
      )}
    </div>
  );
};
