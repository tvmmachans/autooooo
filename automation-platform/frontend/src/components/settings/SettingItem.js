import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { cn } from '../../lib/utils';
export const SettingItem = ({ label, description, children, className, required = false, }) => {
    return (_jsxs("div", { className: cn('space-y-2', className), children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-900 dark:text-gray-100", children: [label, required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] }), description && (_jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: description }))] }), _jsx("div", { children: children })] }));
};
//# sourceMappingURL=SettingItem.js.map