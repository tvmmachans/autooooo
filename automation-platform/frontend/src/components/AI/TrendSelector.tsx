import React, { useState } from 'react';

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

const PLATFORMS = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'google_trends', label: 'Google Trends' },
];

const REGIONS = [
  { value: 'IN', label: 'India' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
];

export const TrendSelector: React.FC<TrendSelectorProps> = ({ config, onChange }) => {
  const [localConfig, setLocalConfig] = useState<TrendConfig>(config);

  const updateConfig = (updates: Partial<TrendConfig>) => {
    const newConfig = { ...localConfig, ...updates };
    setLocalConfig(newConfig);
    onChange(newConfig);
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium mb-1">Platform</label>
        <select
          value={localConfig.platform}
          onChange={(e) => updateConfig({ platform: e.target.value as any })}
          className="w-full p-2 border rounded"
        >
          {PLATFORMS.map((platform) => (
            <option key={platform.value} value={platform.value}>
              {platform.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Region</label>
        <select
          value={localConfig.region}
          onChange={(e) => updateConfig({ region: e.target.value })}
          className="w-full p-2 border rounded"
        >
          {REGIONS.map((region) => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Language</label>
        <input
          type="text"
          value={localConfig.language}
          onChange={(e) => updateConfig({ language: e.target.value })}
          placeholder="e.g., english, malayalam"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category (Optional)</label>
        <input
          type="text"
          value={localConfig.category || ''}
          onChange={(e) => updateConfig({ category: e.target.value })}
          placeholder="e.g., technology, entertainment"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Max Trends</label>
        <input
          type="number"
          value={localConfig.maxTrends || 5}
          onChange={(e) => updateConfig({ maxTrends: parseInt(e.target.value) })}
          className="w-full p-2 border rounded"
          min={1}
          max={20}
        />
      </div>
    </div>
  );
};

