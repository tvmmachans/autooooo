import React from 'react';
interface TrendConfig {
    platform: 'youtube' | 'instagram' | 'google_trends';
    region: string;
    language: string;
    category?: string;
    maxTrends?: number;
}
interface TrendSelectorProps {
    config: TrendConfig;
    onChange: (config: TrendConfig) => void;
}
export declare const TrendSelector: React.FC<TrendSelectorProps>;
export {};
//# sourceMappingURL=TrendSelector.d.ts.map