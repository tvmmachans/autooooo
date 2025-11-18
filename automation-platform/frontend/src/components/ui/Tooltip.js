import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
export const Tooltip = ({ content, children, side = 'top' }) => {
    return (_jsx(TooltipPrimitive.Provider, { children: _jsxs(TooltipPrimitive.Root, { children: [_jsx(TooltipPrimitive.Trigger, { asChild: true, children: children }), _jsx(TooltipPrimitive.Portal, { children: _jsxs(TooltipPrimitive.Content, { side: side, className: "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg z-50", sideOffset: 5, children: [content, _jsx(TooltipPrimitive.Arrow, { className: "fill-gray-900 dark:fill-gray-100" })] }) })] }) }));
};
//# sourceMappingURL=Tooltip.js.map