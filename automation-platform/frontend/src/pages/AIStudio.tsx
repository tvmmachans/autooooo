import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AINodeConfig, type AIConfig } from '../components/AI/AINodeConfig';
import { ContentPreview } from '../components/AI/ContentPreview';
import { VoiceConfig } from '../components/AI/VoiceConfig';
import { TrendSelector } from '../components/AI/TrendSelector';
import { Sparkles } from 'lucide-react';

export const AIStudio: React.FC = () => {
  const [config, setConfig] = React.useState<AIConfig>({
    model: 'auto',
    language: 'malayalam',
    generationType: 'reel_script',
  });

  const [content, setContent] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);

  return (
    <div className="p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          AI Studio
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Generate content with AI</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card glass>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Configuration</h2>
              <Button
                onClick={() => {
                  setIsGenerating(true);
                  // Simulate generation
                  setTimeout(() => {
                    setContent('Generated content will appear here...');
                    setIsGenerating(false);
                  }, 2000);
                }}
                isLoading={isGenerating}
                magnetic
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
            <AINodeConfig
              config={config}
              onChange={(newConfig) => setConfig(newConfig)}
            />
          </Card>

          <Card glass>
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <ContentPreview
              content={content}
              isLoading={isGenerating}
              model={config.model}
              provider={config.model === 'auto' ? 'auto-selected' : config.model}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card glass>
            <h2 className="text-xl font-semibold mb-4">Voice Settings</h2>
            <VoiceConfig
              config={{ language: config.language }}
              onChange={() => {}}
            />
          </Card>

          <Card glass>
            <h2 className="text-xl font-semibold mb-4">Trend Settings</h2>
            <TrendSelector
              config={{
                platform: 'youtube',
                region: 'IN',
                language: config.language,
              }}
              onChange={() => {}}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

