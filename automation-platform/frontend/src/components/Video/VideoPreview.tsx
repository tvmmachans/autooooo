import React from 'react';

interface VideoPreviewProps {
  videoUrl?: string;
  thumbnailUrl?: string;
  title?: string;
  duration?: number;
  status?: 'processing' | 'completed' | 'failed';
  isLoading?: boolean;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoUrl,
  thumbnailUrl,
  title,
  duration,
  status,
  isLoading,
}) => {
  if (isLoading || status === 'processing') {
    return (
      <div className="p-8 border rounded-lg bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing video...</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="p-8 border rounded-lg bg-red-50 text-center">
        <p className="text-red-600">Video generation failed</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {videoUrl ? (
        <video
          src={videoUrl}
          controls
          className="w-full"
          poster={thumbnailUrl}
        >
          Your browser does not support the video tag.
        </video>
      ) : thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={title || 'Video thumbnail'}
          className="w-full"
        />
      ) : (
        <div className="p-8 bg-gray-100 text-center text-gray-500">
          No video preview available
        </div>
      )}
      {title && (
        <div className="p-4 bg-white">
          <h3 className="font-medium">{title}</h3>
          {duration && (
            <p className="text-sm text-gray-500">
              Duration: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

