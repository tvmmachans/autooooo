import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeType } from './types.js';
import { isActionNode, isConditionNode, isStartNode, isEndNode } from './types.js';
// Action Node Component
const ActionNodeComponent = ({ data, selected }) => {
    if (!isActionNode(data))
        return null;
    const config = data.config;
    const hasErrors = data.validationErrors && data.validationErrors.length > 0;
    return (_jsxs("div", { className: `px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-blue-500' : 'border-stone-400'} ${hasErrors ? 'border-red-500' : ''}`, children: [_jsx(Handle, { type: "target", position: Position.Top, className: "w-3 h-3 bg-blue-500" }), _jsx("div", { className: "flex items-center", children: _jsxs("div", { className: "ml-2", children: [_jsx("div", { className: "text-lg font-bold text-blue-600", children: "Action" }), _jsx("div", { className: "text-sm text-gray-600 capitalize", children: config.actionType })] }) }), hasErrors && (_jsx("div", { className: "mt-2 text-xs text-red-600", children: data.validationErrors.map((error, idx) => (_jsxs("div", { children: ["\u2022 ", error] }, idx))) })), _jsx(Handle, { type: "source", position: Position.Bottom, className: "w-3 h-3 bg-blue-500" })] }));
};
// Condition Node Component
const ConditionNodeComponent = ({ data, selected }) => {
    if (!isConditionNode(data))
        return null;
    const config = data.config;
    const hasErrors = data.validationErrors && data.validationErrors.length > 0;
    return (_jsxs("div", { className: `px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-green-500' : 'border-stone-400'} ${hasErrors ? 'border-red-500' : ''}`, children: [_jsx(Handle, { type: "target", position: Position.Top, className: "w-3 h-3 bg-green-500" }), _jsx("div", { className: "flex items-center", children: _jsxs("div", { className: "ml-2", children: [_jsx("div", { className: "text-lg font-bold text-green-600", children: "Condition" }), _jsxs("div", { className: "text-sm text-gray-600", children: [config.conditions.length, " condition(s)"] }), _jsx("div", { className: "text-xs text-gray-500", children: config.logicOperator })] }) }), hasErrors && (_jsx("div", { className: "mt-2 text-xs text-red-600", children: data.validationErrors.map((error, idx) => (_jsxs("div", { children: ["\u2022 ", error] }, idx))) })), _jsx(Handle, { type: "source", position: Position.Bottom, id: "true", className: "w-3 h-3 bg-green-500" }), _jsx(Handle, { type: "source", position: Position.Right, id: "false", className: "w-3 h-3 bg-red-500" })] }));
};
// Start Node Component
const StartNodeComponent = ({ data, selected }) => {
    if (!isStartNode(data))
        return null;
    const config = data.config;
    const hasErrors = data.validationErrors && data.validationErrors.length > 0;
    return (_jsxs("div", { className: `px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-purple-500' : 'border-stone-400'} ${hasErrors ? 'border-red-500' : ''}`, children: [_jsx("div", { className: "flex items-center", children: _jsxs("div", { className: "ml-2", children: [_jsx("div", { className: "text-lg font-bold text-purple-600", children: "Start" }), config.trigger && (_jsx("div", { className: "text-sm text-gray-600 capitalize", children: config.trigger }))] }) }), hasErrors && (_jsx("div", { className: "mt-2 text-xs text-red-600", children: data.validationErrors.map((error, idx) => (_jsxs("div", { children: ["\u2022 ", error] }, idx))) })), _jsx(Handle, { type: "source", position: Position.Bottom, className: "w-3 h-3 bg-purple-500" })] }));
};
// End Node Component
const EndNodeComponent = ({ data, selected }) => {
    if (!isEndNode(data))
        return null;
    const config = data.config;
    const hasErrors = data.validationErrors && data.validationErrors.length > 0;
    return (_jsxs("div", { className: `px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-red-500' : 'border-stone-400'} ${hasErrors ? 'border-red-500' : ''}`, children: [_jsx(Handle, { type: "target", position: Position.Top, className: "w-3 h-3 bg-red-500" }), _jsx("div", { className: "flex items-center", children: _jsxs("div", { className: "ml-2", children: [_jsx("div", { className: "text-lg font-bold text-red-600", children: "End" }), config.successMessage && (_jsx("div", { className: "text-sm text-gray-600 truncate max-w-32", children: config.successMessage }))] }) }), hasErrors && (_jsx("div", { className: "mt-2 text-xs text-red-600", children: data.validationErrors.map((error, idx) => (_jsxs("div", { children: ["\u2022 ", error] }, idx))) }))] }));
};
// Node type mapping for React Flow
export const nodeTypes = {
    [NodeType.START]: memo(StartNodeComponent),
    [NodeType.ACTION]: memo(ActionNodeComponent),
    [NodeType.CONDITION]: memo(ConditionNodeComponent),
    [NodeType.END]: memo(EndNodeComponent),
};
export const ActionNodeConfigForm = ({ config, onChange, errors = [] }) => {
    const handleActionTypeChange = (actionType) => {
        onChange({ ...config, actionType });
    };
    const handleConfigChange = (key, value) => {
        onChange({ ...config, [key]: value });
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Action Type" }), _jsxs("select", { value: config.actionType || '', onChange: (e) => handleActionTypeChange(e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "Select action type" }), _jsx("option", { value: "http", children: "HTTP Request" }), _jsx("option", { value: "delay", children: "Delay" }), _jsx("option", { value: "setVariable", children: "Set Variable" }), _jsx("option", { value: "log", children: "Log Message" })] })] }), config.actionType === 'http' && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Method" }), _jsxs("select", { value: config.httpConfig?.method || 'GET', onChange: (e) => handleConfigChange('httpConfig', { ...config.httpConfig, method: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", children: [_jsx("option", { value: "GET", children: "GET" }), _jsx("option", { value: "POST", children: "POST" }), _jsx("option", { value: "PUT", children: "PUT" }), _jsx("option", { value: "DELETE", children: "DELETE" }), _jsx("option", { value: "PATCH", children: "PATCH" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "URL" }), _jsx("input", { type: "url", value: config.httpConfig?.url || '', onChange: (e) => handleConfigChange('httpConfig', { ...config.httpConfig, url: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", placeholder: "https://api.example.com/endpoint" })] })] })), config.actionType === 'delay' && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Duration (ms)" }), _jsx("input", { type: "number", value: config.delayConfig?.duration || '', onChange: (e) => handleConfigChange('delayConfig', { duration: parseInt(e.target.value) || 0 }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", min: "0" })] })), config.actionType === 'setVariable' && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Variable Name" }), _jsx("input", { type: "text", value: config.variableConfig?.variableName || '', onChange: (e) => handleConfigChange('variableConfig', { ...config.variableConfig, variableName: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Variable Value" }), _jsx("textarea", { value: JSON.stringify(config.variableConfig?.variableValue || '', null, 2), onChange: (e) => {
                                    try {
                                        const parsed = JSON.parse(e.target.value);
                                        handleConfigChange('variableConfig', { ...config.variableConfig, variableValue: parsed });
                                    }
                                    catch {
                                        handleConfigChange('variableConfig', { ...config.variableConfig, variableValue: e.target.value });
                                    }
                                }, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", rows: 3 })] })] })), config.actionType === 'log' && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Log Level" }), _jsxs("select", { value: config.logConfig?.level || 'info', onChange: (e) => handleConfigChange('logConfig', { ...config.logConfig, level: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", children: [_jsx("option", { value: "info", children: "Info" }), _jsx("option", { value: "warn", children: "Warning" }), _jsx("option", { value: "error", children: "Error" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Message" }), _jsx("input", { type: "text", value: config.logConfig?.message || '', onChange: (e) => handleConfigChange('logConfig', { ...config.logConfig, message: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" })] })] })), errors.length > 0 && (_jsx("div", { className: "text-red-600 text-sm", children: errors.map((error, idx) => (_jsxs("div", { children: ["\u2022 ", error] }, idx))) }))] }));
};
export const ConditionNodeConfigForm = ({ config, onChange, errors = [] }) => {
    const handleLogicOperatorChange = (logicOperator) => {
        onChange({ ...config, logicOperator });
    };
    const handleConditionChange = (index, condition) => {
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
    const removeCondition = (index) => {
        const newConditions = config.conditions.filter((_, i) => i !== index);
        onChange({ ...config, conditions: newConditions });
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Logic Operator" }), _jsxs("select", { value: config.logicOperator || 'AND', onChange: (e) => handleLogicOperatorChange(e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500", children: [_jsx("option", { value: "AND", children: "AND" }), _jsx("option", { value: "OR", children: "OR" })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Conditions" }), _jsx("button", { type: "button", onClick: addCondition, className: "text-green-600 hover:text-green-800 text-sm", children: "+ Add Condition" })] }), _jsx("div", { className: "space-y-3 mt-2", children: (config.conditions || []).map((condition, index) => (_jsxs("div", { className: "border rounded-md p-3 bg-gray-50", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("span", { className: "text-sm font-medium", children: ["Condition ", index + 1] }), _jsx("button", { type: "button", onClick: () => removeCondition(index), className: "text-red-600 hover:text-red-800 text-sm", children: "Remove" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-600", children: "Left" }), _jsx("input", { type: "text", value: condition.left || '', onChange: (e) => handleConditionChange(index, { ...condition, left: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm", placeholder: "variable.name" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-600", children: "Operator" }), _jsxs("select", { value: condition.operator || 'equals', onChange: (e) => handleConditionChange(index, { ...condition, operator: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm", children: [_jsx("option", { value: "equals", children: "Equals" }), _jsx("option", { value: "notEquals", children: "Not Equals" }), _jsx("option", { value: "greaterThan", children: "Greater Than" }), _jsx("option", { value: "lessThan", children: "Less Than" }), _jsx("option", { value: "contains", children: "Contains" }), _jsx("option", { value: "matches", children: "Matches" })] })] })] }), _jsxs("div", { className: "mt-2", children: [_jsx("label", { className: "block text-xs text-gray-600", children: "Right Value" }), _jsx("input", { type: "text", value: condition.right || '', onChange: (e) => handleConditionChange(index, { ...condition, right: e.target.value }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm", placeholder: "comparison value" })] })] }, index))) })] }), errors.length > 0 && (_jsx("div", { className: "text-red-600 text-sm", children: errors.map((error, idx) => (_jsxs("div", { children: ["\u2022 ", error] }, idx))) }))] }));
};
export const StartNodeConfigForm = ({ config, onChange, errors = [] }) => {
    const handleTriggerChange = (trigger) => {
        onChange({ ...config, trigger });
    };
    const handleVariablesChange = (variables) => {
        onChange({ ...config, variables });
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Trigger Type" }), _jsxs("select", { value: config.trigger || '', onChange: (e) => handleTriggerChange(e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500", children: [_jsx("option", { value: "", children: "Manual" }), _jsx("option", { value: "webhook", children: "Webhook" }), _jsx("option", { value: "schedule", children: "Schedule" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Initial Variables (JSON)" }), _jsx("textarea", { value: JSON.stringify(config.variables || {}, null, 2), onChange: (e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                handleVariablesChange(parsed);
                            }
                            catch {
                                // Invalid JSON, keep as string for now
                            }
                        }, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500", rows: 4, placeholder: '{"key": "value"}' })] }), errors.length > 0 && (_jsx("div", { className: "text-red-600 text-sm", children: errors.map((error, idx) => (_jsxs("div", { children: ["\u2022 ", error] }, idx))) }))] }));
};
export const EndNodeConfigForm = ({ config, onChange, errors = [] }) => {
    const handleOutputMappingChange = (outputMapping) => {
        onChange({ ...config, outputMapping });
    };
    const handleSuccessMessageChange = (successMessage) => {
        onChange({ ...config, successMessage });
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Success Message" }), _jsx("input", { type: "text", value: config.successMessage || '', onChange: (e) => handleSuccessMessageChange(e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500", placeholder: "Workflow completed successfully" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Output Mapping (JSON)" }), _jsx("textarea", { value: JSON.stringify(config.outputMapping || {}, null, 2), onChange: (e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                handleOutputMappingChange(parsed);
                            }
                            catch {
                                // Invalid JSON, keep as string for now
                            }
                        }, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500", rows: 4, placeholder: '{"result": "variableName"}' })] }), errors.length > 0 && (_jsx("div", { className: "text-red-600 text-sm", children: errors.map((error, idx) => (_jsxs("div", { children: ["\u2022 ", error] }, idx))) }))] }));
};
//# sourceMappingURL=NodeTypes.js.map