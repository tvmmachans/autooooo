# ⚡ Quick Start Guide

Get your automation platform running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 15+ installed and running
- Redis installed and running (or use Docker)

## 1. Install Dependencies

```bash
# Backend
cd automation-platform/backend
npm install

# Frontend
cd ../frontend
npm install
```

## 2. Setup Environment

Copy the example env file and fill in your values:

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set at minimum:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - A secure random string (32+ characters)
- `REFRESH_TOKEN_SECRET` - Another secure random string

## 3. Setup Database

```bash
# Create database (in PostgreSQL)
createdb automation_platform

# Push schema to database
npm run db:push
```

## 4. Start Services

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

### Terminal 3: Redis (if not using Docker)
```bash
redis-server
```

Or with Docker:
```bash
docker run -d -p 6379:6379 redis:alpine
```

## 5. Verify It Works

Open your browser:
- Frontend: http://localhost:3000
- Backend Health: http://localhost:3001/health

## 🎯 First Workflow Test

1. **Create Account**: Sign up at http://localhost:3000
2. **Create Workflow**: Click "New Workflow"
3. **Add AI Node**: Drag "AI Content" node onto canvas
4. **Configure**:
   - Language: Malayalam
   - Content Type: Reel Script
   - Prompt: "Create a reel about AI automation"
5. **Execute**: Click "Run Workflow"
6. **View Results**: See generated Malayalam content!

## 🚀 Next Steps

- Add AI API keys for full functionality (see `.env.example`)
- Explore other AI nodes (TTS, Translation, Trends)
- Upload media files for social posts
- Create workflow templates
- Set up API keys for external integrations

## 🆘 Troubleshooting

**Database connection error?**
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env`

**Redis connection error?**
- Check Redis is running: `redis-cli ping`
- Rate limiting will work without Redis (just won't limit)

**Port already in use?**
- Change PORT in `.env` file
- Update FRONTEND_URL if changed

**Module not found?**
- Run `npm install` again
- Delete `node_modules` and reinstall

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

