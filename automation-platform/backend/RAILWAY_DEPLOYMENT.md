# Railway Deployment Guide

This backend is configured for zero-build deployment on Railway. No TypeScript compilation required!

## ⚠️ Important: Root Package.json Removed

The root `package.json` has been **deleted** to prevent Railway from running TypeScript build commands from the root directory. Railway will now use the `automation-platform/backend/package.json` instead.

## Quick Deploy Steps

1. **Install dependencies locally** (optional, for testing):
   ```bash
   cd automation-platform/backend
   npm install
   ```

2. **Test locally**:
   ```bash
   npm start
   ```
   Server should start on `http://localhost:3001`

3. **Deploy to Railway**:
   - Connect your GitHub repository to Railway
   - **IMPORTANT**: Set the **Root Directory** to `automation-platform/backend` in Railway project settings
   - Railway will automatically detect the `railway.toml` configuration
   - Set environment variables in Railway dashboard (see below)
   - Deploy!

## Environment Variables

Set these in Railway dashboard under your project settings:

### Required:
- `NODE_ENV=production`
- `PORT` (Railway sets this automatically, but you can override)

### Optional:
- `FRONTEND_URL` - Your frontend URL for CORS (defaults to `*`)

## Health Check

Railway will automatically monitor the `/health` endpoint:
- **Endpoint**: `/health`
- **Expected Response**: `200 OK` with JSON status

## What Changed

✅ **Removed root package.json** - Prevents Railway from running build commands from root
✅ **Removed TypeScript** - Pure JavaScript now
✅ **No build step** - Direct execution with `node src/index.js`
✅ **Minimal dependencies** - Only Express, CORS, and dotenv
✅ **Railway configured** - `railway.toml` with health checks
✅ **Zero compilation errors** - No `tsc` permission issues

## Railway Configuration

**Critical Step**: In Railway dashboard:
1. Go to your project **Settings**
2. Set **Root Directory** to: `automation-platform/backend`
3. This ensures Railway uses the correct `package.json` and `railway.toml`

## File Structure

```
backend/
├── src/
│   └── index.js          # Main server file (JavaScript)
├── package.json          # Simplified dependencies
├── railway.toml          # Railway configuration
└── env.template          # Environment variables template
```

## Adding Features Later

When you're ready to add database, authentication, etc.:

1. Add dependencies to `package.json`
2. Import and use in `src/index.js`
3. Add environment variables to Railway dashboard
4. Redeploy!

No build process needed - just add code and deploy! 🚀

