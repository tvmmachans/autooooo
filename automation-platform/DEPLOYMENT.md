# 🚀 Quick Deployment Checklist

## 1. Environment Setup

### Backend
```bash
cd automation-platform/backend
npm install
```

### Frontend
```bash
cd automation-platform/frontend
npm install
```

## 2. Environment Variables

Create `backend/.env` file:

```env
# Server
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/automation_platform
DB_MAX_CONNECTIONS=10
DB_IDLE_TIMEOUT=20
DB_CONNECT_TIMEOUT=10

# Redis (Required for rate limiting)
REDIS_URL=redis://localhost:6379

# JWT Authentication
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret-min-32-chars
REFRESH_TOKEN_EXPIRES_IN=30d

# AI Services (Optional - services work without them)
SARVAM_API_KEY=
GROQ_API_KEY=
GEMINI_API_KEY=
DEEPSEEK_API_KEY=

# TTS Service
TTS_API_URL=http://localhost:8000
TTS_STORAGE_PATH=./storage/audio

# Media Storage
MEDIA_STORAGE_PATH=./storage/media
MEDIA_PUBLIC_URL=/api/media

# Logging
LOG_LEVEL=info
LOGS_DIR=./logs

# Feature Flags
ENABLE_RATE_LIMITING=true
ENABLE_API_KEYS=true
```

## 3. Database Setup

### Option A: Push Schema Directly (Development)
```bash
cd backend
npm run push
```

### Option B: Generate Migrations (Production)
```bash
cd backend
npm run migrate
# Review generated migrations in src/database/migrations/
# Then apply them to your database
```

### Create Database (PostgreSQL)
```sql
CREATE DATABASE automation_platform;
```

## 4. Start Services

### Terminal 1 - Backend
```bash
cd automation-platform/backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd automation-platform/frontend
npm run dev
```

### Terminal 3 - Redis (Required for rate limiting)
```bash
redis-server
```

Or using Docker:
```bash
docker run -d -p 6379:6379 redis:alpine
```

## 5. Verify Installation

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### Test Endpoints
```bash
# Health check
curl http://localhost:3001/health

# Should return: {"status":"ok","timestamp":"..."}
```

## 🔧 Key Features Ready to Use

### 🤖 AI Content Generation
- ✅ Malayalam content via Sarvam AI
- ✅ Multi-language support (English, Tamil, Hindi, Telugu, Kannada)
- ✅ Smart model routing (auto-selects best model)
- ✅ Text-to-speech with Malayalam voices
- ✅ Trending content generation
- ✅ Reel script generation (Hook, Story, Value, CTA, Hashtags)

### 📊 Workflow Automation
- ✅ Visual workflow builder
- ✅ 5 new AI nodes + all core nodes
- ✅ Real-time execution monitoring
- ✅ Workflow templates
- ✅ Import/Export workflows

### 🔒 Production Features
- ✅ Rate limiting & API security
- ✅ Error handling & logging
- ✅ User authentication & RBAC
- ✅ Media upload & management
- ✅ API key management
- ✅ Environment validation

## 🎯 Immediate Testing

### Test AI Content Generation
1. Create a new workflow
2. Add → **AIContentNode** → Set language to "Malayalam"
3. Configure prompt and generation type
4. Execute workflow
5. View generated content

### Test TTS (Text-to-Speech)
1. Add → **AITTSNode** → Connect after AIContentNode
2. Set language to "Malayalam"
3. Execute workflow
4. Download generated audio file

### Test Media Upload
1. Navigate to Media Library
2. Upload an image or video
3. Verify thumbnail generation
4. Use media in social media posts

### Test Rate Limiting
```bash
# Make rapid requests to see rate limiting in action
for i in {1..110}; do
  curl http://localhost:3001/api/workflows
done
# Should see rate limit headers and 429 response after limit
```

### Test API Keys
1. Create API key via `/api/api/keys` endpoint
2. Use API key in header: `X-API-Key: your-key`
3. Execute workflows via public API

## 📈 Production Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
LOG_LEVEL=warn
ENABLE_RATE_LIMITING=true
```

### Build for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Run Production Server
```bash
cd backend
npm start
```

### Recommended Production Setup
- Use PM2 or similar process manager
- Set up reverse proxy (Nginx)
- Enable SSL/TLS
- Configure database connection pooling
- Set up log rotation
- Monitor Redis and database connections

## 🐳 Docker Deployment (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: automation_platform
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/automation_platform
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

## 🔍 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format
- Check PostgreSQL is running
- Verify database exists
- Check user permissions

### Redis Connection Issues
- Verify Redis is running: `redis-cli ping`
- Check REDIS_URL format
- Rate limiting will gracefully degrade if Redis is unavailable

### AI Service Issues
- Services work without API keys (with limited functionality)
- Check API key format if using services
- Review logs for specific error messages

### Media Upload Issues
- Verify storage directories exist
- Check file permissions
- Verify MEDIA_STORAGE_PATH is writable

## 📚 Next Steps

1. **Set up AI API keys** for full functionality
2. **Configure TTS service** (XTTS v2 or alternative)
3. **Set up monitoring** (optional)
4. **Configure backups** for database
5. **Set up CI/CD** pipeline

## 🆘 Support

- Check logs in `backend/logs/` directory
- Review error messages in API responses
- Verify all environment variables are set
- Check database migrations completed successfully

