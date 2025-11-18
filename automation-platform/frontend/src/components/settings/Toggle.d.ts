import React from 'react';
interface ToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}
export declare const Toggle: React.FC<ToggleProps>;
export {};
//# sourceMappingURL=Toggle.d.ts.map