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

const PLATFORMS = [
  { value: 'youtube', label: 'YouTube', icon: '📺' },
  { value: 'instagram', label: 'Instagram Reels', icon: '📷' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵' },
  { value: 'facebook', label: 'Facebook', icon: '👥' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
];

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatforms,
  onPlatformsChange,
  onConfigChange,
  configs,
}) => {
  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      onPlatformsChange(selectedPlatforms.filter(p => p !== platform));
    } else {
      onPlatformsChange([...selectedPlatforms, platform]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Select Platforms</label>
        <div className="grid grid-cols-2 gap-2">
          {PLATFORMS.map((platform) => (
            <label
              key={platform.value}
              className={`flex items-center p-3 border rounded cursor-pointer ${
                selectedPlatforms.includes(platform.value)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedPlatforms.includes(platform.value)}
                onChange={() => togglePlatform(platform.value)}
                className="mr-2"
              />
              <span className="mr-2">{platform.icon}</span>
              <span>{platform.label}</span>
            </label>
          ))}
        </div>
      </div>

      {selectedPlatforms.map((platform) => (
        <div key={platform} className="p-4 border rounded">
          <h3 className="font-medium mb-3">
            {PLATFORMS.find(p => p.value === platform)?.label} Settings
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={configs[platform]?.title || ''}
                onChange={(e) =>
                  onConfigChange(platform, { title: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Video title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={configs[platform]?.description || ''}
                onChange={(e) =>
                  onConfigChange(platform, { description: e.target.value })
                }
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Video description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={configs[platform]?.tags?.join(', ') || ''}
                onChange={(e) =>
                  onConfigChange(platform, {
                    tags: e.target.value.split(',').map(t => t.trim()),
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="tag1, tag2, tag3"
              />
            </div>
            {platform === 'youtube' && (
              <div>
                <label className="block text-sm font-medium mb-1">Visibility</label>
                <select
                  value={configs[platform]?.visibility || 'public'}
                  onChange={(e) =>
                    onConfigChange(platform, {
                      visibility: e.target.value as any,
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="private">Private</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Schedule (Optional)</label>
              <input
                type="datetime-local"
                value={configs[platform]?.scheduledAt || ''}
                onChange={(e) =>
                  onConfigChange(platform, { scheduledAt: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

