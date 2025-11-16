# 🎬 Video Generation System Guide

Complete guide to using the AI video generation and social media automation features.

## 🚀 Quick Start

### 1. Prerequisites

```bash
# Install FFmpeg (required for video processing)
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### 2. Environment Setup

Add to `backend/.env`:

```env
# Video Storage
VIDEO_STORAGE_PATH=./storage/videos
VIDEO_PUBLIC_URL=/api/videos
FFMPEG_PATH=ffmpeg

# Stock Media (Optional but recommended)
PEXELS_API_KEY=your_pexels_key
UNSPLASH_API_KEY=your_unsplash_key

# Platform APIs (Optional - for direct uploads)
YOUTUBE_API_KEY=...
INSTAGRAM_ACCESS_TOKEN=...
TIKTOK_ACCESS_TOKEN=...
```

### 3. Database Migration

```bash
cd backend
npm run db:push
```

## 📹 Video Generation Workflow

### Basic Video Creation

1. **Add AIVideoNode** to your workflow
2. **Configure**:
   - Script: Your video script (or let AI generate)
   - Language: Malayalam, English, etc.
   - Aspect Ratio: 9:16 (Reels), 16:9 (YouTube), 1:1 (Square)
   - Media Query: Keywords for stock footage search
3. **Execute** workflow
4. **Get** generated video with audio, visuals, and subtitles

### Complete Video Pipeline

```
Start → AIContentNode (Generate Script)
  → AITTSNode (Generate Voiceover)
  → AIVideoNode (Compose Video)
  → ThumbnailAINode (Generate Thumbnail)
  → PlatformUploadNode (Upload to Social Media)
```

## 🎨 Features

### AI Video Generation
- ✅ Automatic script generation
- ✅ Text-to-speech voiceover (Malayalam + multiple languages)
- ✅ Stock footage integration (Pexels, Unsplash)
- ✅ Auto-generated subtitles
- ✅ Background music mixing
- ✅ Multiple aspect ratios (9:16, 16:9, 1:1)

### Platform Upload
- ✅ YouTube (Shorts & regular videos)
- ✅ Instagram Reels
- ✅ TikTok
- ✅ Facebook
- ✅ LinkedIn
- ✅ Scheduled publishing
- ✅ Multi-platform cross-posting

### Video Assets
- ✅ Stock media library search
- ✅ Custom media upload
- ✅ AI-generated thumbnails
- ✅ Subtitle customization

## 🔧 Workflow Nodes

### AIVideoNode
Generates complete video from script or AI-generated content.

**Input:**
- `script` - Video script text
- `language` - Voiceover language
- `aspectRatio` - 9:16, 16:9, or 1:1
- `mediaQuery` - Keywords for stock footage

**Output:**
- `videoUrl` - Generated video URL
- `thumbnailUrl` - Thumbnail image
- `duration` - Video duration in seconds
- `subtitles` - Generated subtitle segments

### PlatformUploadNode
Uploads video to one or multiple social platforms.

**Input:**
- `videoId` - Video database ID
- `videoPath` - Local video file path
- `platforms` - Array of platforms to upload to
- `title`, `description`, `tags` - Platform-specific metadata

**Output:**
- `uploads` - Upload results per platform
- `platformVideoId` - Video ID on each platform
- `platformUrl` - Published video URL

### ThumbnailAINode
Generates engaging thumbnails for videos.

**Input:**
- `videoPath` - Video file path
- `title` - Video title
- `useAIGeneration` - Use AI to enhance thumbnail

**Output:**
- `thumbnailUrl` - Generated thumbnail URL
- `thumbnailPath` - Local file path

## 📊 Analytics

Track video performance across platforms:

```typescript
// Get video analytics
const analytics = await videoAnalyticsService.getVideoAnalytics(videoId);

// Get aggregated stats
const stats = await videoAnalyticsService.getAggregatedAnalytics(videoId, 'youtube');
```

## 🎯 Platform-Specific Configurations

### YouTube
- Max duration: 60s (Shorts) or unlimited (regular)
- Aspect ratio: 9:16 (Shorts) or 16:9 (regular)
- Required: Title, description
- Optional: Tags, thumbnail, scheduled time

### Instagram Reels
- Max duration: 90 seconds
- Aspect ratio: 9:16
- Required: Caption
- Features: Audio sync, trending audio

### TikTok
- Max duration: 60 seconds
- Aspect ratio: 9:16
- Required: Caption
- Features: Duets, stitches

### Facebook
- Max duration: 240 minutes
- Aspect ratio: 16:9 or 1:1
- Required: Description

### LinkedIn
- Max duration: 10 minutes
- Aspect ratio: 16:9 or 1:1
- Required: Description

## 🔌 API Integrations

### Stock Media APIs

**Pexels** (Free tier: 200 requests/hour)
- Videos and images
- High quality
- Commercial use allowed

**Unsplash** (Free tier: 50 requests/hour)
- High-quality images
- Commercial use allowed

### Platform APIs Setup

1. **YouTube**: Google Cloud Console → YouTube Data API v3
2. **Instagram**: Facebook Developers → Instagram Graph API
3. **TikTok**: TikTok for Business → Marketing API
4. **Facebook**: Facebook Developers → Graph API
5. **LinkedIn**: LinkedIn Marketing Developer Platform

## 💡 Best Practices

### Video Creation
1. **Script Quality**: Use AI to generate engaging hooks
2. **Visual Variety**: Mix stock footage with custom assets
3. **Subtitles**: Always include for better engagement
4. **Thumbnails**: Use AI-generated thumbnails for better CTR

### Platform Optimization
1. **Aspect Ratios**: Use 9:16 for Reels/Shorts, 16:9 for YouTube
2. **Durations**: Keep Reels under 60s, Shorts under 60s
3. **Hashtags**: Research platform-specific trending hashtags
4. **Posting Times**: Schedule for optimal engagement

### Multi-Platform Strategy
1. **One Script, Multiple Formats**: Adapt same content for different platforms
2. **Platform-Specific Hooks**: Customize opening for each platform
3. **Cross-Posting**: Use PlatformUploadNode to post to all platforms
4. **Analytics**: Track performance per platform

## 🐛 Troubleshooting

### FFmpeg Not Found
```bash
# Verify installation
ffmpeg -version

# Set path in .env
FFMPEG_PATH=/usr/local/bin/ffmpeg
```

### Video Processing Fails
- Check video file format (MP4 recommended)
- Verify FFmpeg has required codecs
- Check storage directory permissions
- Review logs in `backend/logs/`

### Platform Upload Errors
- Verify API credentials in `.env`
- Check OAuth token expiration
- Review platform API rate limits
- Ensure video meets platform requirements

## 📈 Next Steps

1. **Set up API keys** for stock media and platforms
2. **Create your first video workflow**
3. **Test multi-platform upload**
4. **Monitor analytics** and optimize
5. **Scale** with templates and automation

For more details, see [DEPLOYMENT.md](./DEPLOYMENT.md)

