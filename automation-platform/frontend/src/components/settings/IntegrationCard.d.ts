import React from 'react';
interface IntegrationCardProps {
    platform: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    connected: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
    username?: string;
    color?: string;
}
export declare const IntegrationCard: React.FC<IntegrationCardProps>;
export {};
//# sourceMappingURL=IntegrationCard.d.ts.map