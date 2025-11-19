# Render Deployment Guide

This backend is configured for zero-build deployment on Render. No TypeScript compilation required!

## ✅ Backend Preparation Checklist

Your `backend/package.json` is already configured correctly:
- ✅ **No build scripts** - Direct execution with `node src/index.js`
- ✅ **Minimal dependencies** - Only Express, CORS, and dotenv
- ✅ **Simple start command** - `npm start` runs the server directly
- ✅ **Node.js version specified** - `engines.node >= 18.0.0`

## Quick Deploy Steps

### Option 1: Using render.yaml (Recommended)

1. **Verify your backend is ready**:
   ```bash
   cd automation-platform/backend
   npm install
   npm start
   ```
   Server should start on `http://localhost:3001`

2. **Deploy to Render**:
   - Push your code to GitHub (make sure `render.yaml` is in the repository root)
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **New +** → **Blueprint**
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` in the repository root
   - The `render.yaml` already specifies `rootDir: automation-platform/backend`
   - Render will use the configuration from `render.yaml`
   - Deploy!

### Option 2: Manual Configuration (Dashboard)

1. **Create a new Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **New +** → **Web Service**
   - Connect your GitHub repository

2. **Configure the service**:
   - **Name**: `automation-platform-backend`
   - **Root Directory**: `automation-platform/backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install` (or leave empty - Render auto-detects)
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose your preferred plan)

3. **Set Environment Variables**:
   - `NODE_ENV` = `production`
   - `PORT` = (Render sets this automatically)
   - `FRONTEND_URL` = Your frontend URL (optional, defaults to `*`)

4. **Configure Health Check**:
   - **Health Check Path**: `/health`
   - Render will automatically monitor this endpoint

5. **Deploy!**

## Environment Variables

### Required:
- `NODE_ENV=production` (Render can set this automatically)
- `PORT` (Render sets this automatically - don't override)

### Optional:
- `FRONTEND_URL` - Your frontend URL for CORS (defaults to `*`)

### For Future Use (when adding features):
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret (min 32 characters)
- `REFRESH_TOKEN_SECRET` - Refresh token secret (min 32 characters)
- `REDIS_URL` - Redis connection string

## Health Check

Render automatically monitors the `/health` endpoint:
- **Endpoint**: `/health`
- **Expected Response**: `200 OK` with JSON:
  ```json
  {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.45,
    "environment": "production"
  }
  ```

## Render Configuration File

The `render.yaml` file in `automation-platform/backend/` contains:
- Service type: Web Service
- Build command: `npm install` (no TypeScript compilation)
- Start command: `npm start`
- Health check path: `/health`
- Environment variables template

## What Makes This Render-Ready

✅ **No TypeScript** - Pure JavaScript, no compilation needed
✅ **No build step** - Direct execution with `node src/index.js`
✅ **Simple package.json** - Only production dependencies
✅ **Health check endpoint** - `/health` for Render monitoring
✅ **Environment-based port** - Uses `process.env.PORT` (Render provides this)
✅ **Graceful shutdown** - Handles SIGTERM for Render restarts
✅ **Error handling** - Proper error middleware

## Troubleshooting

### Issue: "Cannot find module"
- **Solution**: Make sure Root Directory is set to `automation-platform/backend` in Render dashboard

### Issue: "Port already in use"
- **Solution**: Render sets `PORT` automatically - don't hardcode it. Use `process.env.PORT || 3001`

### Issue: Health check failing
- **Solution**: Verify `/health` endpoint returns 200 OK. Check Render logs for errors.

### Issue: Build timeout
- **Solution**: Render free tier has build timeouts. Consider upgrading or optimizing dependencies.

## Adding Database Later

When ready to add PostgreSQL:

1. In Render dashboard, create a **PostgreSQL** database
2. Add `DATABASE_URL` environment variable (Render provides this automatically)
3. Update your code to use the database
4. Redeploy!

## File Structure

```
Repository Root:
├── render.yaml           # Render Blueprint configuration (in root)

automation-platform/backend/
├── src/
│   └── index.js          # Main server file (JavaScript)
├── package.json          # Simplified dependencies
└── env.template          # Environment variables template
```

## Next Steps

1. ✅ Backend is ready - `package.json` is configured correctly
2. ✅ `render.yaml` is created - Render will use this for configuration
3. 🚀 Deploy to Render using one of the methods above
4. 📝 Add environment variables in Render dashboard
5. ✅ Verify health check is working

Your backend is now ready for Render deployment! 🎉

