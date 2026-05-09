# SwiftDrop Deployment Guide

Complete guide for deploying SwiftDrop with:
- **Backend**: Render.com (Node.js + PostgreSQL)
- **Frontend**: Vercel.com (React + Vite)
- **Email**: Postmark
- **Auth**: Supabase

## Architecture Overview

```
┌─────────────────────┐
│   Vercel Frontend   │
│   swiftdrop.vercel  │
│   (React + Vite)    │
└──────────┬──────────┘
           │ API Calls
           ▼
┌─────────────────────┐
│  Render Backend API │
│  OnRender.com       │
│  (Node + Express)   │
└──────────┬──────────┘
           │
    ┌──────┴──────┬──────────┬──────────┐
    ▼             ▼          ▼          ▼
PostgreSQL  Postmark     Supabase    External APIs
(Database)  (Email)      (Auth)      (M-Pesa, etc.)
```

## Phase 1: Backend Deployment (Render)

### 1.1 Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub
- Link your repository

### 1.2 Create PostgreSQL Database
```
Dashboard → Databases → New PostgreSQL
├─ Name: swiftdrop-db
├─ Version: 15
├─ Region: Frankfurt (eu-central-1)
└─ Plan: Starter (free)
```

Save the internal connection string (not external URL).

### 1.3 Deploy Backend via Blueprint
```
Render Dashboard → Blueprints → New Blueprint
├─ Select your GitHub repo
├─ Authorize Render
└─ Blueprint deploys from render.yaml
```

Render detects `render.yaml` and creates:
- Web service (API server)
- PostgreSQL database
- Environment variables

### 1.4 Set Environment Variables

Go to **Service** → **Settings** → **Environment**

Add these (marked as missing):

```env
POSTMARK_API_TOKEN=[Copy from Postmark dashboard]
ADMIN_BYPASS_SECRET=[Generate strong random string]
```

**How to generate ADMIN_BYPASS_SECRET:**
```bash
# Option 1: On Mac/Linux
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Use any online tool
# https://www.random.org/strings/?num=1&len=32&digits=on&upperalpha=on&loweralpha=on
```

### 1.5 Run Database Migrations

After database is created, run migrations:

```bash
# Option 1: Via Render Shell
1. Click your service name
2. "Shell" tab
3. Run: npm run prisma:migrate -- --name init

# Option 2: Via GitHub Actions
# (Add CI/CD file to repo - optional)
```

### 1.6 Verify Backend is Running

```bash
curl https://[your-service-name].onrender.com/health
# Response: { "ok": true, "service": "SwiftDrop API" }
```

You'll get your backend URL like:
```
https://swiftdrop-api-xxxxx.onrender.com
```

**Save this URL** - you'll need it for frontend deployment.

---

## Phase 2: Frontend Deployment (Vercel)

### 2.1 Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub
- Import project

### 2.2 Import GitHub Repository

```
Vercel Dashboard → Add New → Project
├─ Select your GitHub repo
├─ Framework Preset: Vite
└─ Click "Deploy"
```

First deployment will likely fail (missing env vars) - this is OK.

### 2.3 Set Environment Variables

Go to **Settings** → **Environment Variables**

Add these variables for **Production** environment:

```env
VITE_API_BASE_URL=https://swiftdrop-api-xxxxx.onrender.com
VITE_SUPABASE_URL=[From Supabase Settings]
VITE_SUPABASE_ANON_KEY=[From Supabase Settings]
```

**How to find Supabase credentials:**
1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Settings → API
4. Copy `Project URL` → `VITE_SUPABASE_URL`
5. Copy `anon public` key → `VITE_SUPABASE_ANON_KEY`

### 2.4 Redeploy Frontend

In Vercel Dashboard:
- Click "Deployments" tab
- Find the first failed deployment
- Click the "..." menu
- Select "Redeploy"

Frontend will rebuild with environment variables.

### 2.5 Verify Frontend is Running

Visit:
```
https://[your-vercel-project].vercel.app
```

You should see SwiftDrop login page! ✅

---

## Phase 3: Configure Services

### 3.1 Postmark Configuration

1. Create Postmark account: [postmarkapp.com](https://postmarkapp.com)
2. Create templates (follow [backend/POSTMARK_SETUP.md](backend/POSTMARK_SETUP.md))
3. Get Server API token from Postmark dashboard
4. Add to Render environment variables: `POSTMARK_API_TOKEN`

### 3.2 Supabase Configuration

Already mentioned above, but ensure:
- Email/OTP auth is enabled
- Redirect URLs include your Vercel frontend URL:
- In Vercel, set `VITE_APP_URL` to your live frontend URL so the app generates production callback links

```
Settings → Auth → Providers → Email
├─ Confirm Email (enabled)
├─ Redirect URLs
│  ├─ http://localhost:3000/auth/callback
│  └─ https://your-vercel-url.vercel.app/auth/callback
```

---

## Phase 4: Test End-to-End

### 4.1 Test User Registration

1. Visit your Vercel frontend URL
2. Click "Sign Up"
3. Enter email, name, phone
4. Check email for magic link
5. Click link → Should create user
6. Welcome email should arrive in inbox

### 4.2 Monitor Logs

**Backend (Render):**
```
Dashboard → Your Service → Logs
(Real-time API logs)
```

**Frontend (Vercel):**
```
Dashboard → Deployments → Latest → Logs
(Build & deployment logs)
```

---

## Phase 5: Custom Domain (Optional)

### 5.1 Frontend Custom Domain (Vercel)

```
Project Settings → Domains
├─ Add Domain: swiftdrop.co.ke
├─ Follow DNS instructions
└─ Wait for propagation
```

### 5.2 Backend Custom Domain (Render)

```
Service Settings → Custom Domains
├─ Add: api.swiftdrop.co.ke
├─ Add CNAME: [provided by Render]
└─ Update frontend VITE_API_BASE_URL
   to https://api.swiftdrop.co.ke
```

Then update Vercel environment variables.

---

## Troubleshooting

### Backend Not Starting

Check logs in Render:
```
Service → Logs
(Red error messages)
```

Common issues:
- ❌ `DATABASE_URL` not set → Check environment variables
- ❌ Port binding error → Check PORT variable
- ❌ Prisma issues → Run migrations manually

### Frontend Build Fails

```
Dashboard → Deployments → [Failed] → Logs
(Blue build output)
```

Common issues:
- ❌ Missing env vars → Check Settings → Environment Variables
- ❌ TypeScript errors → Run `npm run build` locally to debug
- ❌ Node version mismatch → Restart deployment

### API Calls Failing

Check browser console (F12 → Console):
```javascript
// Should show correct API URL
console.log(import.meta.env.VITE_API_BASE_URL)

// Should be: https://swiftdrop-api-xxxxx.onrender.com
```

Then verify:
- ✅ Backend is healthy: `curl https://api-url/health`
- ✅ CORS enabled on backend (already configured)
- ✅ No firewall blocking requests

### Emails Not Sending

1. Check Postmark API token is valid
2. Check email templates exist in Postmark
3. Check Postmark quota not exceeded
4. Look at Postmark Activity log for bounces/complaints

---

## Environment Variables Summary

### Render (Backend)

Required for production:
- `DATABASE_URL` - Auto from database
- `NODE_ENV` - `production`
- `POSTMARK_API_TOKEN` - From Postmark
- `ADMIN_BYPASS_SECRET` - Generate random string

Optional:
- `POSTMARK_FROM_EMAIL` - Default: `noreply@swiftdrop.co.ke`
- `POSTMARK_TEMPLATE_ALIAS_PREFIX` - Default: `swiftdrop`
- `PORT` - Default: `4000`

### Vercel (Frontend)

Required for production:
- `VITE_API_BASE_URL` - Your Render backend URL
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key

Optional:
- `VITE_DEV_AUTH_USER` - For local development only

---

## Monitoring in Production

### Render Dashboard
- Dashboard → Service → Logs (real-time)
- Settings → Metrics (CPU, memory, disk)

### Vercel Dashboard
- Project Home → Analytics (page speed, usage)
- Deployments (deployment history)

### Postmark Dashboard
- Activity (all emails sent/bounced)
- Account → Sending Domains (verify sender)

### Supabase Dashboard
- Auth → Users (user list)
- Logs (auth events)
- Database (data)

---

## Scaling Tips

### If Backend Gets Slow
1. Render → Service Settings → Instance Type
2. Upgrade from Starter to Professional
3. May incur costs

### If Frontend Gets Slow
1. Vercel → Settings → Performance
2. Check Core Web Vitals
3. Optimize images/code splitting

### If Emails Queue Up
1. Check Postmark quota
2. Upgrade Postmark plan if needed
3. Consider async email queue

---

## Next Steps

- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Test full user flow
- [ ] Monitor logs for 24 hours
- [ ] Set up custom domains
- [ ] Enable analytics/monitoring
- [ ] Plan backup strategy

## Support

For issues, check:
1. **Render Docs**: [render.com/docs](https://render.com/docs)
2. **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
3. **Postmark Docs**: [postmarkapp.com/developer](https://postmarkapp.com/developer)
4. **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

## Quick Links

| Service | URL | Role |
|---------|-----|------|
| Render | [render.com](https://render.com) | Backend hosting |
| Vercel | [vercel.com](https://vercel.com) | Frontend hosting |
| Postmark | [postmarkapp.com](https://postmarkapp.com) | Email service |
| Supabase | [supabase.com](https://supabase.com) | Authentication |
