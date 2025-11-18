import React from 'react';
interface VoiceConfig {
    language: string;
    voice?: string;
    speed?: number;
    format?: 'mp3' | 'wav';
}
interface VoiceConfigProps {
    config: VoiceConfig;
    onChange: (config: VoiceConfig) => void;
}
export declare const VoiceConfig: React.FC<VoiceConfigProps>;
export {};
//# sourceMappingURL=VoiceConfig.d.ts.map