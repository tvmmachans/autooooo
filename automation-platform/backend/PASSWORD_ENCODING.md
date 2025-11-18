# Password URL Encoding for Supabase

## Issue
Your Supabase password contains special characters (`%` and `$`) that need to be URL-encoded in the connection string.

## Solution

### Option 1: Use Supabase Dashboard Connection String (Easiest)
1. Go to: https://supabase.com/dashboard/project/sdqprmqsnswjegudcjky/settings/database
2. Scroll to "Connection string" → "URI" tab
3. Copy the **entire connection string** (it already has the password properly encoded)
4. Paste it directly into your `.env` file as `DATABASE_URL=...`

### Option 2: Manually Encode Password

If your password is: `Zzk655SzjVzD%B$`

URL-encode the special characters:
- `%` → `%25`
- `$` → `%24`

Encoded password: `Zzk655SzjVzD%25B%24`

Then your connection string becomes:
```
DATABASE_URL=postgresql://postgres:Zzk655SzjVzD%25B%24@db.sdqprmqsnswjegudcjky.supabase.co:5432/postgres
```

### Option 3: Reset Password (If Needed)

If you're unsure of your password:
1. Go to: https://supabase.com/dashboard/project/sdqprmqsnswjegudcjky/settings/database
2. Click "Reset database password"
3. Copy the new password
4. Use Option 1 or 2 above to set it in your `.env`

## Special Characters Reference

| Character | URL Encoded |
|-----------|-------------|
| `%`       | `%25`       |
| `$`       | `%24`       |
| `#`       | `%23`       |
| `&`       | `%26`       |
| `+`       | `%2B`       |
| `@`       | `%40`       |
| ` ` (space) | `%20`     |

## Verify Your Connection String

Your final `.env` should have:
```env
DATABASE_URL=postgresql://postgres:[ENCODED-PASSWORD]@db.sdqprmqsnswjegudcjky.supabase.co:5432/postgres
```

Make sure:
- ✅ Port is **5432** (direct connection)
- ✅ Host is `db.sdqprmqsnswjegudcjky.supabase.co`
- ✅ Password is URL-encoded if it contains special characters

