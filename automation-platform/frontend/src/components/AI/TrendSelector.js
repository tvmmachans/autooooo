import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const PLATFORMS = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'google_trends', label: 'Google Trends' },
];
const REGIONS = [
    { value: 'IN', label: 'India' },
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
];
export const TrendSelector = ({ config, onChange }) => {
    const [localConfig, setLocalConfig] = useState(config);
    const updateConfig = (updates) => {
        const newConfig = { ...localConfig, ...updates };
        setLocalConfig(newConfig);
        onChange(newConfig);
    };
    return (_jsxs("div", { className: "space-y-4 p-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Platform" }), _jsx("select", { value: localConfig.platform, onChange: (e) => updateConfig({ platform: e.target.value }), className: "w-full p-2 border rounded", children: PLATFORMS.map((platform) => (_jsx("option", { value: platform.value, children: platform.label }, platform.value))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Region" }), _jsx("select", { value: localConfig.region, onChange: (e) => updateConfig({ region: e.target.value }), className: "w-full p-2 border rounded", children: REGIONS.map((region) => (_jsx("option", { value: region.value, children: region.label }, region.value))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Language" }), _jsx("input", { type: "text", value: localConfig.language, onChange: (e) => updateConfig({ language: e.target.value }), placeholder: "e.g., english, malayalam", className: "w-full p-2 border rounded" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Category (Optional)" }), _jsx("input", { type: "text", value: localConfig.category || '', onChange: (e) => updateConfig({ category: e.target.value }), placeholder: "e.g., technology, entertainment", className: "w-full p-2 border rounded" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Max Trends" }), _jsx("input", { type: "number", value: localConfig.maxTrends || 5, onChange: (e) => updateConfig({ maxTrends: parseInt(e.target.value) }), className: "w-full p-2 border rounded", min: 1, max: 20 })] })] }));
};
//# sourceMappingURL=TrendSelector.js.map