import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingItem } from '../../components/settings/SettingItem';
import { Button } from '../../components/ui/Button';
import { CreditCard, TrendingUp } from 'lucide-react';
import { Card } from '../../components/ui/Card';
export const BillingSettings = () => {
    // Mock data - in real app, fetch from API
    const currentPlan = {
        name: 'Pro',
        price: 29,
        period: 'month',
        features: [
            'Unlimited workflows',
            'Advanced AI models',
            'Priority support',
            'Custom integrations',
        ],
    };
    const usage = {
        workflows: { used: 45, limit: 100 },
        aiGenerations: { used: 1200, limit: 5000 },
        storage: { used: 2.5, limit: 10 }, // GB
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsx(SettingsSection, { title: "Current Plan", description: "Manage your subscription and billing", icon: _jsx(CreditCard, { className: "w-6 h-6" }), children: _jsxs(Card, { className: "p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-2xl font-bold", children: [currentPlan.name, " Plan"] }), _jsxs("p", { className: "text-blue-100 mt-1", children: ["$", currentPlan.price, "/", currentPlan.period] })] }), _jsx(Button, { variant: "secondary", className: "bg-white/20 hover:bg-white/30", children: "Upgrade" })] }), _jsx("ul", { className: "space-y-2", children: currentPlan.features.map((feature, i) => (_jsxs("li", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-white" }), _jsx("span", { children: feature })] }, i))) })] }) }), _jsx(SettingsSection, { title: "Usage Statistics", description: "Track your current usage and limits", icon: _jsx(TrendingUp, { className: "w-6 h-6" }), children: _jsxs("div", { className: "space-y-4", children: [_jsx(SettingItem, { label: "Workflows", children: _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsxs("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: [usage.workflows.used, " / ", usage.workflows.limit] }), _jsxs("span", { className: "text-sm font-medium", children: [Math.round((usage.workflows.used / usage.workflows.limit) * 100), "%"] })] }), _jsx("div", { className: "w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-blue-500 to-purple-600", style: { width: `${(usage.workflows.used / usage.workflows.limit) * 100}%` } }) })] }) }), _jsx(SettingItem, { label: "AI Generations", children: _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsxs("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: [usage.aiGenerations.used.toLocaleString(), " / ", usage.aiGenerations.limit.toLocaleString()] }), _jsxs("span", { className: "text-sm font-medium", children: [Math.round((usage.aiGenerations.used / usage.aiGenerations.limit) * 100), "%"] })] }), _jsx("div", { className: "w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-blue-500 to-purple-600", style: { width: `${(usage.aiGenerations.used / usage.aiGenerations.limit) * 100}%` } }) })] }) }), _jsx(SettingItem, { label: "Storage", children: _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsxs("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: [usage.storage.used, " GB / ", usage.storage.limit, " GB"] }), _jsxs("span", { className: "text-sm font-medium", children: [Math.round((usage.storage.used / usage.storage.limit) * 100), "%"] })] }), _jsx("div", { className: "w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-blue-500 to-purple-600", style: { width: `${(usage.storage.used / usage.storage.limit) * 100}%` } }) })] }) })] }) }), _jsx(SettingsSection, { title: "Billing History", description: "View and download your invoices", icon: _jsx(CreditCard, { className: "w-6 h-6" }), children: _jsx("div", { className: "text-center py-8 text-gray-500", children: _jsx("p", { children: "Billing history will appear here" }) }) })] }));
};
//# sourceMappingURL=BillingSettings.js.map