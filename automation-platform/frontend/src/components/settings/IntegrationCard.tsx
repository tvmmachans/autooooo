import React from 'react';
import { Check, X, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

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

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  name,
  icon,
  description,
  connected,
  onConnect,
  onDisconnect,
  username,
  color = 'blue',
}) => {
  return (
    <Card className={cn('p-4', connected && 'border-2 border-green-500')}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div
            className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center',
              `bg-${color}-100 dark:bg-${color}-900/30`
            )}
          >
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
              {connected && (
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <Check className="w-4 h-4" />
                  <span className="text-xs font-medium">Connected</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
            {connected && username && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Connected as: <span className="font-medium">{username}</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {connected ? (
            <>
              <Button variant="ghost" size="sm" onClick={onDisconnect}>
                <X className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={onConnect}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Connect
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

