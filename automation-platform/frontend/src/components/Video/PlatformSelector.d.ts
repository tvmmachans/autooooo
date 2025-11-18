import React from 'react';
interface PlatformConfig {
    platform: 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'linkedin';
    title: string;
    description?: string;
    tags?: string[];
    scheduledAt?: string;
    visibility?: 'public' | 'unlisted' | 'private';
}
interface PlatformSelectorProps {
    selectedPlatforms: string[];
    onPlatformsChange: (platforms: string[]) => void;
    onConfigChange: (platform: string, config: Partial<PlatformConfig>) => void;
    configs: Record<string, Partial<PlatformConfig>>;
}
export declare const PlatformSelector: React.FC<PlatformSelectorProps>;
export {};
//# sourceMappingURL=PlatformSelector.d.ts.map