# Verify Your Database Connection String

## ✅ Correct Format for Migrations

Your `.env` file **MUST** use the **direct connection** with port **5432**:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.sdqprmqsnswjegudcjky.supabase.co:5432/postgres
```

## Key Points:

1. **Port must be 5432** (direct connection)
2. **Host must be**: `db.sdqprmqsnswjegudcjky.supabase.co`
3. **NOT**: `pooler.supabase.com:6543` (this is for production app, not migrations)

## How to Verify:

1. Open your `.env` file: `automation-platform/backend/.env`
2. Find the `DATABASE_URL` line
3. Check that it contains:
   - `:5432` (not `:6543`)
   - `db.sdqprmqsnswjegudcjky.supabase.co` (not `pooler.supabase.com`)

## Example:

✅ **CORRECT** (for migrations):
```
DATABASE_URL=postgresql://postgres:mypassword123@db.sdqprmqsnswjegudcjky.supabase.co:5432/postgres
```

❌ **WRONG** (won't work for migrations):
```
DATABASE_URL=postgresql://postgres.sdqprmqsnswjegudcjky:mypassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## Quick Check Command:

Run this to verify your connection string:
```bash
cd automation-platform/backend
cat .env | grep DATABASE_URL
```

Make sure it shows port **5432**, not **6543**.

