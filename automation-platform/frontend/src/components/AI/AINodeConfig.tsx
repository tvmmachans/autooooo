import React, { useState } from 'react';

interface AIConfig {
  model: 'auto' | 'sarvam' | 'groq' | 'gemini' | 'deepseek';
  language: string;
  generationType: 'reel_script' | 'caption' | 'blog' | 'translation' | 'general';
  tone?: string;
  platform?: string;
  maxTokens?: number;
  temperature?: number;
}

interface AINodeConfigProps {
  config: AIConfig;
  onChange: (config: AIConfig) => void;
}

const LANGUAGES = [
  { value: 'malayalam', label: 'Malayalam' },
  { value: 'english', label: 'English' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'kannada', label: 'Kannada' },
];

const MODELS = [
  { value: 'auto', label: 'Auto (Smart Selection)' },
  { value: 'sarvam', label: 'Sarvam AI (Malayalam/Indian)' },
  { value: 'groq', label: 'Groq Llama 3.1 (Fast Multilingual)' },
  { value: 'gemini', label: 'Gemini Flash 2.0 (Creative)' },
  { value: 'deepseek', label: 'DeepSeek (Trending/Viral)' },
];

const GENERATION_TYPES = [
  { value: 'reel_script', label: 'Reel Script' },
  { value: 'caption', label: 'Social Media Caption' },
  { value: 'blog', label: 'Blog Post' },
  { value: 'translation', label: 'Translation' },
  { value: 'general', label: 'General Content' },
];

export const AINodeConfig: React.FC<AINodeConfigProps> = ({ config, onChange }) => {
  const [localConfig, setLocalConfig] = useState<AIConfig>(config);

  const updateConfig = (updates: Partial<AIConfig>) => {
    const newConfig = { ...localConfig, ...updates };
    setLocalConfig(newConfig);
    onChange(newConfig);
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium mb-1">Model</label>
        <select
          value={localConfig.model}
          onChange={(e) => updateConfig({ model: e.target.value as any })}
          className="w-full p-2 border rounded"
        >
          {MODELS.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>
      </div>

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
        <label className="block text-sm font-medium mb-1">Content Type</label>
        <select
          value={localConfig.generationType}
          onChange={(e) => updateConfig({ generationType: e.target.value as any })}
          className="w-full p-2 border rounded"
        >
          {GENERATION_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tone (Optional)</label>
        <input
          type="text"
          value={localConfig.tone || ''}
          onChange={(e) => updateConfig({ tone: e.target.value })}
          placeholder="e.g., engaging, professional, casual"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Platform (Optional)</label>
        <input
          type="text"
          value={localConfig.platform || ''}
          onChange={(e) => updateConfig({ platform: e.target.value })}
          placeholder="e.g., instagram, youtube, facebook"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Max Tokens</label>
          <input
            type="number"
            value={localConfig.maxTokens || 1000}
            onChange={(e) => updateConfig({ maxTokens: parseInt(e.target.value) })}
            className="w-full p-2 border rounded"
            min={100}
            max={4000}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Temperature</label>
          <input
            type="number"
            value={localConfig.temperature || 0.7}
            onChange={(e) => updateConfig({ temperature: parseFloat(e.target.value) })}
            className="w-full p-2 border rounded"
            min={0}
            max={2}
            step={0.1}
          />
        </div>
      </div>
    </div>
  );
};

