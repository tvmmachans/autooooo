import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';
export const SettingsSection = ({ title, description, children, className, icon, }) => {
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, className: cn('space-y-6', className), children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [icon && _jsx("div", { className: "text-gray-500 dark:text-gray-400", children: icon }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: title })] }), description && (_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: description }))] }), _jsx(Card, { glass: true, className: "p-6 space-y-6", children: children })] }));
};
//# sourceMappingURL=SettingsSection.js.map