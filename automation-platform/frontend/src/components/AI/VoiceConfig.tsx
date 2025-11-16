import React, { useState } from 'react';

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

const LANGUAGES = [
  { value: 'malayalam', label: 'Malayalam' },
  { value: 'english', label: 'English' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'hindi', label: 'Hindi' },
];

export const VoiceConfig: React.FC<VoiceConfigProps> = ({ config, onChange }) => {
  const [localConfig, setLocalConfig] = useState<VoiceConfig>(config);

  const updateConfig = (updates: Partial<VoiceConfig>) => {
    const newConfig = { ...localConfig, ...updates };
    setLocalConfig(newConfig);
    onChange(newConfig);
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium mb-1">Language</label>
        <select
          value={localConfig.language}
          onChange={(e) => updateConfig({ language: e.target.value })}
          className="w-full p-2 border rounded"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Voice (Optional)</label>
        <input
          type="text"
          value={localConfig.voice || ''}
          onChange={(e) => updateConfig({ voice: e.target.value })}
          placeholder="Leave empty for default voice"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Speed: {localConfig.speed || 1.0}x
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={localConfig.speed || 1.0}
          onChange={(e) => updateConfig({ speed: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Format</label>
        <select
          value={localConfig.format || 'mp3'}
          onChange={(e) => updateConfig({ format: e.target.value as 'mp3' | 'wav' })}
          className="w-full p-2 border rounded"
        >
          <option value="mp3">MP3</option>
          <option value="wav">WAV</option>
        </select>
      </div>
    </div>
  );
};

