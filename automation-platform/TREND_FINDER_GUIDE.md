# 🔍 Real Trend Finder System Guide

Complete guide to using the live trend discovery and analysis system.

## ✨ Features

### Live API Integrations
- ✅ **Google Trends** - Real search data by region
- ✅ **YouTube Trends** - Trending videos and keywords
- ✅ **Instagram** - Hashtag popularity
- ✅ **Twitter** - Real-time trending topics
- ✅ **TikTok** - Video trends and hashtags

### Regional & Language Support
- ✅ **Kerala/Malayalam** - Kerala-specific trends
- ✅ **Tamil Nadu/Tamil** - Tamil-specific trends
- ✅ **India-wide** - Multi-language support
- ✅ **Language-specific filtering** - Malayalam, Tamil, Hindi, English

### Advanced Analysis
- ✅ **Trend Scoring** - Multi-factor trend score calculation
- ✅ **Momentum Tracking** - Growth/decline detection
- ✅ **Seasonal Detection** - Pattern recognition
- ✅ **Trend Fatigue** - Declining interest detection
- ✅ **Competitor Tracking** - Monitor competitor content

## 🚀 Quick Start

### 1. Environment Setup

Add to `backend/.env`:

```env
# Google Trends (uses RSS feed, no API key needed)
# YouTube Data API
YOUTUBE_API_KEY=your_youtube_key

# Instagram Graph API
INSTAGRAM_ACCESS_TOKEN=your_token
INSTAGRAM_USER_ID=your_user_id

# Twitter API v2
TWITTER_BEARER_TOKEN=your_bearer_token

# TikTok Business API
TIKTOK_ACCESS_TOKEN=your_token
```

### 2. Database Setup

```bash
cd backend
npm run db:push
```

## 📊 Usage Examples

### Get Kerala Trends (Malayalam)

```typescript
// In workflow: LiveTrendFinderNode
{
  region: "IN-KL",
  language: "malayalam",
  platforms: ["google_trends", "youtube", "instagram"]
}
```

### Analyze Trends

```typescript
// In workflow: TrendAnalyzerNode
{
  region: "IN-KL",
  language: "malayalam",
  analyzeAll: true
}
```

### Track Competitors

```typescript
// In workflow: CompetitorTrendNode
{
  competitorHandles: ["@competitor1", "@competitor2"],
  platform: "youtube"
}
```

## 🎯 Workflow Nodes

### LiveTrendFinderNode
Discovers real-time trends from multiple platforms.

**Input:**
- `region` - IN-KL, IN-TN, IN, etc.
- `language` - malayalam, tamil, english, etc.
- `platforms` - Array of platforms to query
- `category` - Optional category filter
- `maxTrends` - Number of trends to return

**Output:**
- `trends` - Array of trend objects
- `region`, `language`, `platforms`
- `count` - Number of trends found

### TrendAnalyzerNode
Deep analysis of trends with scoring and predictions.

**Input:**
- `keywords` - Specific keywords to analyze
- `region` + `language` - Regional analysis
- `analyzeAll` - Analyze top trends

**Output:**
- `analyses` - Detailed trend analyses
- `topTrends` - Top 10 trends
- `insights` - Aggregated insights

### CompetitorTrendNode
Track what competitors are posting about.

**Input:**
- `competitorHandles` - Array of competitor usernames
- `platform` - youtube, instagram, tiktok
- `trackNew` - Track new content

**Output:**
- `trends` - Aggregated competitor trends
- `competitors` - List of tracked competitors
- `count` - Number of trends found

## 📈 Trend Scoring Algorithm

Trends are scored using a weighted formula:

```
Trend Score = 
  (Volume Score × 0.4) +
  (Momentum Score × 0.3) +
  (Relevance Score × 0.2) +
  (Freshness Score × 0.1)
```

### Components:
- **Volume Score**: Search volume/mentions (logarithmic normalization)
- **Momentum Score**: Growth rate (positive/negative)
- **Relevance Score**: Language/region relevance (0-100)
- **Freshness Score**: How recent the trend is (0-100)

## 🌍 Regional Support

### Kerala (IN-KL) - Malayalam
- Mollywood movie trends
- Kerala politics
- Onam/Vishu festival content
- Kerala tourism
- Malayalam tech influencers

### Tamil Nadu (IN-TN) - Tamil
- Kollywood trends
- Tamil culture
- Pongal festival
- Tamil tech content

### India (IN) - Multi-language
- Pan-India trends
- Language-specific filtering
- National events
- Regional aggregation

## 🔧 API Integrations

### Google Trends
- **Method**: RSS feed parsing
- **Rate Limit**: None (but be respectful)
- **Regions**: IN, IN-KL, IN-TN, etc.
- **Languages**: en, ml, ta, hi, etc.

### YouTube Data API
- **Method**: Official API
- **Rate Limit**: 10,000 units/day (free tier)
- **Features**: Trending videos, search, channel data

### Instagram Graph API
- **Method**: Official API
- **Rate Limit**: Varies by endpoint
- **Features**: Hashtag search, media insights

### Twitter API v2
- **Method**: Official API
- **Rate Limit**: 300 requests/15min (free tier)
- **Features**: Trending topics, tweet search

### TikTok Business API
- **Method**: Official API
- **Rate Limit**: Varies
- **Features**: Trending hashtags, video trends

## 📊 Database Schema

### trend_sources
Tracks different data sources and their configurations.

### trend_data
Stores actual trend information with scores and metadata.

### trend_history
Historical snapshots for trend analysis.

### competitor_trends
Tracks competitor content and trends.

## 🎯 Best Practices

### 1. Regional Targeting
- Use specific regions (IN-KL, IN-TN) for local content
- Match language to region for better relevance
- Combine multiple platforms for comprehensive data

### 2. Trend Analysis
- Analyze trends regularly (daily/weekly)
- Track momentum to catch rising trends early
- Watch for trend fatigue to avoid declining topics

### 3. Competitor Monitoring
- Track top competitors in your niche
- Monitor their trending content
- Identify content gaps and opportunities

### 4. Seasonal Patterns
- Use seasonal detection for festival content
- Plan content around seasonal trends
- Leverage recurring patterns

## 🐛 Troubleshooting

### API Rate Limits
- Implement caching (already included)
- Use multiple API keys if available
- Prioritize important regions/platforms

### Missing Trends
- Check API credentials
- Verify region/language codes
- Review API response logs

### Low Relevance Scores
- Ensure language matches region
- Use regional keywords
- Check category filters

## 📚 Next Steps

1. **Set up API keys** for all platforms
2. **Configure regional sources** in database
3. **Create trend discovery workflows**
4. **Set up competitor tracking**
5. **Monitor and analyze trends regularly**

For more details, see [DEPLOYMENT.md](./DEPLOYMENT.md)

