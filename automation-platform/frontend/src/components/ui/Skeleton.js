import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { cn } from '../../lib/utils';
export const Skeleton = ({ className, variant = 'rectangular', ...props }) => {
    return (_jsx("div", { className: cn('skeleton', variant === 'circular' && 'rounded-full', variant === 'text' && 'rounded', variant === 'rectangular' && 'rounded-lg', className), ...props }));
};
//# sourceMappingURL=Skeleton.js.map