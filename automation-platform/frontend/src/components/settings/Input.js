import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { cn } from '../../lib/utils';
export const Input = React.forwardRef(({ className, label, description, error, icon, ...props }, ref) => {
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5", children: label })), _jsxs("div", { className: "relative", children: [icon && (_jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", children: icon })), _jsx("input", { ref: ref, className: cn('w-full px-4 py-2 rounded-lg border transition-colors', 'bg-white dark:bg-gray-800', 'border-gray-300 dark:border-gray-600', 'text-gray-900 dark:text-gray-100', 'placeholder:text-gray-400 dark:placeholder:text-gray-500', 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent', error && 'border-red-500 focus:ring-red-500', icon && 'pl-10', className), ...props })] }), description && !error && (_jsx("p", { className: "mt-1.5 text-xs text-gray-500 dark:text-gray-400", children: description })), error && (_jsx("p", { className: "mt-1.5 text-xs text-red-500", children: error }))] }));
});
Input.displayName = 'Input';
//# sourceMappingURL=Input.js.map