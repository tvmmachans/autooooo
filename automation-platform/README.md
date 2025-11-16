# 🤖 Automation Platform - n8n-style Workflow Builder

A powerful automation platform with AI content generation, supporting Malayalam and multiple languages.

## ✨ Features

### 🤖 AI Content Generation Engine
- **Multi-language AI**: Sarvam (Malayalam/Indian), Groq (Fast), Gemini (Creative), DeepSeek (Trending)
- **Smart Model Routing**: Automatically selects the best AI model based on language and content type
- **Text-to-Speech**: Malayalam and English TTS with voice caching
- **Content Types**: Reel scripts, captions, blog posts, translations
- **Trending Content**: Generate content from YouTube/Instagram/Google Trends

### 🎬 AI Video Generation System
- **Complete Video Pipeline**: Script → Voiceover → Visuals → Video → Upload
- **Stock Media Integration**: Pexels & Unsplash for high-quality footage
- **Auto-Subtitles**: Multi-language subtitle generation with timing
- **Multi-Platform Upload**: YouTube, Instagram, TikTok, Facebook, LinkedIn
- **Video Analytics**: Track performance across all platforms
- **AI Thumbnails**: Generate engaging thumbnails automatically

### 🔍 Real Trend Finder System
- **Live API Integrations**: Google Trends, YouTube, Instagram, Twitter, TikTok
- **Regional Support**: Kerala/Malayalam, Tamil Nadu/Tamil, India-wide
- **Advanced Analysis**: Trend scoring, momentum tracking, seasonal detection
- **Competitor Tracking**: Monitor competitor content and trends
- **Language Intelligence**: Malayalam, Tamil, Hindi, English support
- **Trend Prediction**: Forecast trend growth and decline

### 📊 Workflow Automation
- Visual workflow builder (React Flow)
- Real-time execution monitoring
- Workflow templates and import/export
- 16+ node types including 11 AI nodes (5 content + 3 video + 3 trends)

### 🔒 Production Ready
- Rate limiting with Redis
- Comprehensive error handling & logging
- User authentication & RBAC
- Media upload & management
- Public REST API with API keys
- Environment validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis (or Docker)

### Installation

```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Setup environment
cd backend
cp .env.example .env
# Edit .env with your database and secrets

# 3. Setup database
createdb automation_platform
npm run db:push

# 4. Start services
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Redis
redis-server
```

**That's it!** Open http://localhost:3000

For detailed instructions, see [QUICK_START.md](./QUICK_START.md) or [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📁 Project Structure

```
automation-platform/
├── backend/
│   ├── src/
│   │   ├── database/        # Drizzle ORM schemas
│   │   ├── engine/          # Workflow engine & nodes
│   │   ├── services/         # AI services, media, etc.
│   │   ├── controllers/     # API controllers
│   │   ├── routes/          # Express routes
│   │   ├── middleware/      # Auth, rate limiting, etc.
│   │   └── config/          # Environment config
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   └── store/           # State management
│   └── package.json
└── docker-compose.yml
```

## 🎯 Usage Examples

### Create AI Content Workflow

1. **Add AIContentNode**
   - Language: Malayalam
   - Type: Reel Script
   - Prompt: "Create a reel about automation"

2. **Add AITTSNode** (optional)
   - Connect after AIContentNode
   - Language: Malayalam
   - Generate audio from script

3. **Execute** and get Malayalam reel script + audio!

### Use Trending Topics

1. **Add TrendContentNode**
   - Platform: YouTube
   - Region: IN
   - Language: Malayalam

2. **Connect to AIContentNode** to generate content from trends

### Translate Content

1. **Add ContentTranslateNode**
   - Source: English
   - Target: Malayalam
   - Input: Your English content

## 🔧 Configuration

### Environment Variables

See `backend/.env.example` for all available options.

**Required:**
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - Authentication secret
- `REDIS_URL` - Redis connection (for rate limiting)

**Optional (AI Services):**
- `SARVAM_API_KEY` - For Malayalam content
- `GROQ_API_KEY` - For fast multilingual
- `GEMINI_API_KEY` - For creative content
- `DEEPSEEK_API_KEY` - For trending content

## 📚 Documentation

- [Quick Start Guide](./QUICK_START.md) - Get running in 5 minutes
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [Video Generation Guide](./VIDEO_GENERATION_GUIDE.md) - Complete video system guide
- [Trend Finder Guide](./TREND_FINDER_GUIDE.md) - Real trend discovery guide
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Technical details
- [Video System Summary](./VIDEO_SYSTEM_SUMMARY.md) - Video features overview
- [Trend Finder Summary](./TREND_FINDER_SUMMARY.md) - Trend system overview

## 🧪 Testing

```bash
cd backend
npm test
```

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

See `docker-compose.yml` for configuration.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License

## 🆘 Support

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for troubleshooting
- Review logs in `backend/logs/`
- Verify environment variables are set correctly

---

Built with ❤️ using TypeScript, React, Express, Drizzle ORM, and AI services.

