# SwiftDrop Deployment Quick Reference

**Status:** ✅ Ready for Production Deployment

## What's Ready

✅ **Backend (Node.js + Express + PostgreSQL)**
- Email service with Postmark integration (8 email types)
- Health check endpoint
- Database migrations
- CORS enabled
- Error handling

✅ **Frontend (React + Vite)**
- Supabase authentication
- API integration with backend
- Production build optimized
- Environment variables configured

✅ **Email (Postmark)**
- 8 email templates ready (templates must be created in Postmark)
- Welcome email on signup
- Order confirmations, status updates, payment receipts, etc.

✅ **Documentation**
- Step-by-step deployment guide
- Environment variable reference
- Troubleshooting guide
- Deployment checklist

---

## Deployment Timeline

**Phase 1: Backend (Render)** - 15-20 minutes
```
1. Create Render account & connect GitHub
2. Create PostgreSQL database
3. Deploy via render.yaml Blueprint
4. Set environment variables
5. Verify health endpoint
```

**Phase 2: Frontend (Vercel)** - 5-10 minutes
```
1. Create Vercel account & connect GitHub
2. Import project
3. Set environment variables
4. Redeploy to trigger build
5. Visit live URL
```

**Phase 3: Email Setup (Postmark)** - 5 minutes
```
1. Create Postmark account (if not done)
2. Create 8 email templates
3. Add API token to Render
4. Test with: npm run test:email
```

---

## Environment Variables Needed

### Render (Backend)

Required to set manually:
```env
POSTMARK_API_TOKEN=your-token-here
ADMIN_BYPASS_SECRET=generate-random-string
```

Auto-configured:
- `DATABASE_URL` (from PostgreSQL)
- `NODE_ENV` = production
- `PORT` = 4000
- `POSTMARK_FROM_EMAIL` = noreply@swiftdrop.co.ke
- `POSTMARK_TEMPLATE_ALIAS_PREFIX` = swiftdrop

### Vercel (Frontend)

Required to set:
```env
VITE_API_BASE_URL=https://swiftdrop-api-xxxxx.onrender.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Key URLs After Deployment

```
Frontend:    https://[project].vercel.app
Backend API: https://swiftdrop-api-xxxxx.onrender.com
Health:      https://swiftdrop-api-xxxxx.onrender.com/health
```

---

## Files Created/Updated

### Configuration Files
- ✅ `render.yaml` - Render Blueprint for automated deployment
- ✅ `vercel.json` - Vercel build configuration
- ✅ `.nvmrc` - Node.js version specification (18.17.0)
- ✅ `backend/.nvmrc` - Backend Node.js version

### Documentation
- ✅ `DEPLOYMENT.md` - Complete deployment guide
- ✅ `DEPLOYMENT_CHECKLIST.md` - Step-by-step verification
- ✅ `VERCEL_DEPLOYMENT.md` - Frontend-specific guide
- ✅ `backend/RENDER_DEPLOYMENT.md` - Backend-specific guide

### Code Changes (Previous Commits)
- ✅ `backend/src/lib/email.ts` - Postmark email service
- ✅ `backend/src/routes/auth.ts` - Welcome email on signup
- ✅ `backend/package.json` - Postmark & dotenv dependencies
- ✅ `backend/src/tests/email.test.ts` - Email testing script

---

## Testing Before Deployment

```bash
# Test email functionality
cd backend
TEST_EMAIL=your-email@gmail.com npm run test:email

# Test build
npm run build
cd ../
npm run build

# Verify git status
git status  # Should be clean
```

---

## Deployment Steps

### 1️⃣ Open Render (5 min)

```
1. Go to render.com
2. Sign up with GitHub
3. Click "New" → "Blueprint"
4. Select your repository
5. Authorize Render to access GitHub
6. Wait for automatic deployment
7. Copy backend URL when ready
```

### 2️⃣ Open Vercel (5 min)

```
1. Go to vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Select your repository
5. Framework: Vite (auto-detected)
6. Click "Deploy"
```

### 3️⃣ Configure Environment Variables

**Vercel Dashboard:**
```
Settings → Environment Variables

VITE_API_BASE_URL=[Copy from Render service URL]
VITE_SUPABASE_URL=[From Supabase Settings]
VITE_SUPABASE_ANON_KEY=[From Supabase Settings]
```

**Render Dashboard:**
```
Service Settings → Environment

POSTMARK_API_TOKEN=[From Postmark]
ADMIN_BYPASS_SECRET=[Generate random]
```

### 4️⃣ Redeploy Frontend

```
Vercel Dashboard:
- Deployments tab
- Click "..." on failed deployment
- Select "Redeploy"
```

### 5️⃣ Test Live

```
1. Visit https://[project].vercel.app
2. Sign up with email
3. Check email for OTP
4. Verify welcome email received
```

---

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails on Vercel | Check Environment Variables → Redeploy |
| API calls error 404 | Verify `VITE_API_BASE_URL` in Vercel env vars |
| Email not sending | Check Postmark API token in Render env vars |
| API endpoint 502 | Check Render logs: Service → Logs |
| Database connection error | Verify `DATABASE_URL` in Render environment |

Check `DEPLOYMENT.md` for detailed troubleshooting.

---

## Monitoring After Deployment

### Daily
- Check Render logs for errors
- Monitor 2-3 user signups
- Verify welcome emails arrive

### Weekly
- Review Postmark activity log
- Check Vercel analytics
- Check Render service metrics

### Monthly
- Review error rates
- Optimize performance
- Plan scaling if needed

---

## Next Actions Checklist

- [ ] Read DEPLOYMENT.md (5 min)
- [ ] Create Render account (1 min)
- [ ] Deploy backend (10 min)
- [ ] Create Vercel account (1 min)
- [ ] Deploy frontend (5 min)
- [ ] Set environment variables (5 min)
- [ ] Test user signup (5 min)
- [ ] Monitor logs (ongoing)

---

## Support Links

| Service | URL | Use For |
|---------|-----|---------|
| Render | [render.com/docs](https://render.com/docs) | Backend hosting |
| Vercel | [vercel.com/docs](https://vercel.com/docs) | Frontend hosting |
| Postmark | [postmarkapp.com/support](https://postmarkapp.com/support) | Email issues |
| Supabase | [supabase.com/docs](https://supabase.com/docs) | Auth issues |

---

## Estimated Timeline

```
Time Estimate: 45-60 minutes total

├─ Render Backend Deployment: 15-20 min
├─ Vercel Frontend Deployment: 5-10 min  
├─ Environment Variables: 10-15 min
├─ Testing: 10 min
└─ Troubleshooting: 5-15 min (if needed)
```

---

## Success = ✅

Deployment is successful when:

1. ✅ Render service is running (`/health` returns 200)
2. ✅ Vercel frontend loads without errors
3. ✅ User can sign up via email OTP
4. ✅ Welcome email arrives in inbox
5. ✅ No errors in logs
6. ✅ API calls work (check Network tab in DevTools)

---

**Ready to deploy? Start with:** [DEPLOYMENT.md](./DEPLOYMENT.md)

**Need help?** Check [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

Generated: May 5, 2026  
SwiftDrop v1.0 Production Ready
