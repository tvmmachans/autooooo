import React from 'react';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingItem } from '../../components/settings/SettingItem';
import { Button } from '../../components/ui/Button';
import { CreditCard, TrendingUp, Zap } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export const BillingSettings: React.FC = () => {
  // Mock data - in real app, fetch from API
  const currentPlan = {
    name: 'Pro',
    price: 29,
    period: 'month',
    features: [
      'Unlimited workflows',
      'Advanced AI models',
      'Priority support',
      'Custom integrations',
    ],
  };

  const usage = {
    workflows: { used: 45, limit: 100 },
    aiGenerations: { used: 1200, limit: 5000 },
    storage: { used: 2.5, limit: 10 }, // GB
  };

  return (
    <div className="space-y-8">
      <SettingsSection
        title="Current Plan"
        description="Manage your subscription and billing"
        icon={<CreditCard className="w-6 h-6" />}
      >
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{currentPlan.name} Plan</h3>
              <p className="text-blue-100 mt-1">
                ${currentPlan.price}/{currentPlan.period}
              </p>
            </div>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30">
              Upgrade
            </Button>
          </div>
          <ul className="space-y-2">
            {currentPlan.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </Card>
      </SettingsSection>

      <SettingsSection
        title="Usage Statistics"
        description="Track your current usage and limits"
        icon={<TrendingUp className="w-6 h-6" />}
      >
        <div className="space-y-4">
          <SettingItem label="Workflows">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {usage.workflows.used} / {usage.workflows.limit}
                </span>
                <span className="text-sm font-medium">
                  {Math.round((usage.workflows.used / usage.workflows.limit) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                  style={{ width: `${(usage.workflows.used / usage.workflows.limit) * 100}%` }}
                />
              </div>
            </div>
          </SettingItem>

          <SettingItem label="AI Generations">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {usage.aiGenerations.used.toLocaleString()} / {usage.aiGenerations.limit.toLocaleString()}
                </span>
                <span className="text-sm font-medium">
                  {Math.round((usage.aiGenerations.used / usage.aiGenerations.limit) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                  style={{ width: `${(usage.aiGenerations.used / usage.aiGenerations.limit) * 100}%` }}
                />
              </div>
            </div>
          </SettingItem>

          <SettingItem label="Storage">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {usage.storage.used} GB / {usage.storage.limit} GB
                </span>
                <span className="text-sm font-medium">
                  {Math.round((usage.storage.used / usage.storage.limit) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                  style={{ width: `${(usage.storage.used / usage.storage.limit) * 100}%` }}
                />
              </div>
            </div>
          </SettingItem>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Billing History"
        description="View and download your invoices"
        icon={<CreditCard className="w-6 h-6" />}
      >
        <div className="text-center py-8 text-gray-500">
          <p>Billing history will appear here</p>
        </div>
      </SettingsSection>
    </div>
  );
};

