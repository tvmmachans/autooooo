import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingItem } from '../../components/settings/SettingItem';
import { Button } from '../../components/ui/Button';
import { Code, Database, Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
export const AdvancedSettings = () => {
    const handleExport = () => {
        // In real app, fetch data and create download
        alert('Export functionality coming soon');
    };
    const handleImport = () => {
        // In real app, open file picker and import
        alert('Import functionality coming soon');
    };
    const handleReset = () => {
        if (confirm('Are you sure you want to reset all settings? This action cannot be undone.')) {
            alert('Reset functionality coming soon');
        }
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs(SettingsSection, { title: "Developer Options", description: "API documentation and developer tools", icon: _jsx(Code, { className: "w-6 h-6" }), children: [_jsx(SettingItem, { label: "API Documentation", description: "View API endpoints and documentation", children: _jsx(Button, { variant: "secondary", onClick: () => window.open('/api-docs', '_blank'), children: "Open API Docs" }) }), _jsx(SettingItem, { label: "Webhook Endpoints", description: "Manage webhook endpoints for workflow triggers", children: _jsx(Button, { variant: "secondary", onClick: () => alert('Webhook management coming soon'), children: "Manage Webhooks" }) })] }), _jsxs(SettingsSection, { title: "Data Management", description: "Export, import, or reset your data", icon: _jsx(Database, { className: "w-6 h-6" }), children: [_jsx(SettingItem, { label: "Export Data", description: "Download all your workflows and settings as JSON", children: _jsxs(Button, { variant: "secondary", onClick: handleExport, children: [_jsx(Download, { className: "w-4 h-4 mr-2" }), "Export All Data"] }) }), _jsx(SettingItem, { label: "Import Data", description: "Import workflows and settings from a JSON file", children: _jsxs(Button, { variant: "secondary", onClick: handleImport, children: [_jsx(Upload, { className: "w-4 h-4 mr-2" }), "Import Data"] }) })] }), _jsx(SettingsSection, { title: "Danger Zone", description: "Irreversible and destructive actions", icon: _jsx(AlertTriangle, { className: "w-6 h-6 text-red-500" }), children: _jsx(Card, { className: "p-6 border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20", children: _jsx(SettingItem, { label: "Reset All Settings", description: "Reset all settings to their default values. This cannot be undone.", children: _jsxs(Button, { variant: "danger", onClick: handleReset, children: [_jsx(Trash2, { className: "w-4 h-4 mr-2" }), "Reset to Defaults"] }) }) }) }), _jsx(SettingsSection, { title: "System Information", description: "Platform version and diagnostics", icon: _jsx(Code, { className: "w-6 h-6" }), children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Platform Version" }), _jsx("span", { className: "font-mono", children: "1.0.0" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "API Version" }), _jsx("span", { className: "font-mono", children: "v1" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Status" }), _jsx("span", { className: "text-green-600 dark:text-green-400", children: "Operational" })] })] }) })] }));
};
//# sourceMappingURL=AdvancedSettings.js.map