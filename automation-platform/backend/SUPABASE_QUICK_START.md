# Quick Start: Connect to Supabase

## Your Project Details
- **Project URL**: https://sdqprmqsnswjegudcjky.supabase.co
- **Project Reference**: `sdqprmqsnswjegudcjky`
- **Dashboard**: https://supabase.com/dashboard/project/sdqprmqsnswjegudcjky

## Step 1: Get Your Connection String

1. Go to your Supabase Dashboard:
   https://supabase.com/dashboard/project/sdqprmqsnswjegudcjky/settings/database

2. Scroll down to **"Connection string"** section

3. Click on the **"URI"** tab

4. You'll see two options. **IMPORTANT: Use the Direct Connection for migrations!**

   **✅ Option A: Direct Connection (REQUIRED for migrations - port 5432)**
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.sdqprmqsnswjegudcjky.supabase.co:5432/postgres
   ```
   - Use this for: Migrations, Admin tasks, Development
   - Port: **5432**

   **Option B: Pooler Connection (For production app - port 6543)**
   ```
   postgresql://postgres.sdqprmqsnswjegudcjky:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   - Use this for: Production application connections
   - Port: **6543**
   - ⚠️ **DO NOT use this for migrations**

5. **Copy the DIRECT connection string** (the one with port 5432) and replace `[YOUR-PASSWORD]` with your actual database password

## Step 2: Update Your .env File

1. Open `automation-platform/backend/.env`

2. Find or add the `DATABASE_URL` line (must use port 5432 for migrations):
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.sdqprmqsnswjegudcjky.supabase.co:5432/postgres
   ```
   
   ⚠️ **Important**: Make sure the connection string uses port **5432** (direct connection), NOT port 6543 (pooler)

3. Replace `[YOUR-PASSWORD]` with your actual Supabase database password

4. Save the file

## Step 3: Run Migrations

Once your `.env` file is updated, run:

```bash
cd automation-platform/backend
npm run db:push
```

This will create all the necessary tables in your Supabase database.

## Troubleshooting

### If you don't know your password:
1. Go to: https://supabase.com/dashboard/project/sdqprmqsnswjegudcjky/settings/database
2. Click **"Reset database password"**
3. Copy the new password
4. Update your `.env` file

### Connection Issues:
- Make sure your IP is allowed (Supabase allows all IPs by default)
- Verify the password is correct (no extra spaces)
- Check that the connection string format is correct

### Migration Issues:
- Ensure `DATABASE_URL` is set correctly in `.env`
- **CRITICAL**: Make sure you're using the **direct connection (port 5432)** for migrations
  - ✅ Correct: `...@db.sdqprmqsnswjegudcjky.supabase.co:5432/postgres`
  - ❌ Wrong: `...pooler.supabase.com:6543/postgres` (this won't work for migrations)
- Check that your Supabase project is active
- Verify the password is correct (no extra spaces or special characters that need encoding)

## Next Steps

After successful migration:
1. ✅ All tables will be created
2. ✅ You can start the backend server: `npm run dev`
3. ✅ The API will be ready to use

## Useful Links

- **Dashboard**: https://supabase.com/dashboard/project/sdqprmqsnswjegudcjky
- **Database Settings**: https://supabase.com/dashboard/project/sdqprmqsnswjegudcjky/settings/database
- **API Docs**: https://supabase.com/dashboard/project/sdqprmqsnswjegudcjky/api

