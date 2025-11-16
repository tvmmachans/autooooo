import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { VideoPreview } from '../components/Video/VideoPreview';
import { PlatformSelector } from '../components/Video/PlatformSelector';

export const VideoStudio: React.FC = () => {
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<string[]>(['youtube']);
  const [platformConfigs, setPlatformConfigs] = React.useState<Record<string, any>>({});

  return (
    <div className="p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
          Video Studio
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Create and publish videos</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card glass>
            <h2 className="text-xl font-semibold mb-4">Video Preview</h2>
            <VideoPreview
              videoUrl=""
              status="processing"
              isLoading={true}
            />
          </Card>
        </div>

        <div>
          <Card glass>
            <h2 className="text-xl font-semibold mb-4">Platform Upload</h2>
            <PlatformSelector
              selectedPlatforms={selectedPlatforms}
              onPlatformsChange={setSelectedPlatforms}
              configs={platformConfigs}
              onConfigChange={(platform, config) => {
                setPlatformConfigs(prev => ({
                  ...prev,
                  [platform]: { ...prev[platform], ...config },
                }));
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

