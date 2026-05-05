# SwiftDrop Deployment Checklist

Complete this checklist to successfully deploy SwiftDrop to production.

## Pre-Deployment (Local)

- [ ] All code committed to GitHub
  ```bash
  git status  # Should show "nothing to commit"
  ```

- [ ] Tests passing
  ```bash
  cd backend
  npm run test:email  # Should succeed
  ```

- [ ] Build succeeds locally
  ```bash
  npm run build  # Frontend
  cd backend && npm run build  # Backend
  ```

- [ ] Documentation updated
  - [ ] README.md
  - [ ] DEPLOYMENT.md
  - [ ] Environment variable docs

---

## Backend Deployment (Render)

### Accounts & Access

- [ ] Render account created and GitHub connected
- [ ] GitHub repository accessible from Render

### Database Setup

- [ ] PostgreSQL database created on Render
  - [ ] Region selected (Frankfurt recommended: eu-central-1)
  - [ ] Version: PostgreSQL 15
  - [ ] Plan: Starter (free)
  
- [ ] Internal connection string saved
  ```
  postgresql://user:password@host:port/dbname
  ```

- [ ] Database is accessible from backend service

### Render Blueprint & Service Setup

- [ ] `render.yaml` file created in repository
  ```bash
  cat render.yaml
  ```

- [ ] Blueprint deployed from GitHub
  - [ ] Service name: swiftdrop-api
  - [ ] Build command: `npm install && npm run build`
  - [ ] Start command: `npm start`
  - [ ] Health check path: `/health`

- [ ] Environment variables set in Render dashboard
  - [ ] `DATABASE_URL` = [from PostgreSQL]
  - [ ] `NODE_ENV` = `production`
  - [ ] `PORT` = `4000`
  - [ ] `POSTMARK_API_TOKEN` = [from Postmark]
  - [ ] `POSTMARK_FROM_EMAIL` = `noreply@swiftdrop.co.ke`
  - [ ] `POSTMARK_TEMPLATE_ALIAS_PREFIX` = `swiftdrop`
  - [ ] `ADMIN_BYPASS_SECRET` = [generated random string]

### Database Migrations

- [ ] Connected to Render shell
  ```bash
  # Run via Render Shell tab
  npm run prisma:migrate -- --name init
  ```

- [ ] Database tables created
  ```bash
  # Verify via Render dashboard or shell
  npm run prisma:generate
  ```

### Backend Verification

- [ ] Health endpoint responding
  ```bash
  curl https://[service-name].onrender.com/health
  # Expected: {"ok":true,"service":"SwiftDrop API"}
  ```

- [ ] Backend URL noted
  ```
  https://swiftdrop-api-[xxxxx].onrender.com
  ```

- [ ] No errors in Render logs
  - [ ] Go to Service → Logs
  - [ ] No red errors visible
  - [ ] Latest log shows service is running

---

## Frontend Deployment (Vercel)

### Accounts & Access

- [ ] Vercel account created and GitHub connected
- [ ] GitHub repository accessible from Vercel

### Vercel Project Setup

- [ ] GitHub repository imported to Vercel
  - [ ] Framework preset: Vite
  - [ ] Build command: `npm run build`
  - [ ] Output directory: `dist`

- [ ] `.nvmrc` file created with Node 18.17.0
  ```bash
  cat .nvmrc  # Output: 18.17.0
  ```

- [ ] `vercel.json` configuration created
  ```bash
  cat vercel.json
  ```

### Environment Variables (Vercel)

- [ ] **Production** environment variables set
  - [ ] `VITE_API_BASE_URL` = `https://swiftdrop-api-[xxxxx].onrender.com`
  - [ ] `VITE_SUPABASE_URL` = [from Supabase Settings → API]
  - [ ] `VITE_SUPABASE_ANON_KEY` = [from Supabase Settings → API]

- [ ] **Preview** environment variables set (same as above)

### Frontend Deployment

- [ ] Frontend deployment triggered (re-deploy if failed initially)
  - [ ] Deployments tab → Click failed deployment → Redeploy
  - [ ] Wait for build to complete (green checkmark)

- [ ] Frontend URL noted
  ```
  https://[project-name].vercel.app
  ```

- [ ] No errors in Vercel build logs
  - [ ] Click latest deployment → Logs
  - [ ] Final deployment status: "Success"

### Frontend Verification

- [ ] Frontend loading
  - [ ] Visit `https://[project-name].vercel.app`
  - [ ] Page loads, no 404 errors
  - [ ] No console errors (F12 → Console)

- [ ] API connection working
  - [ ] Open DevTools (F12)
  - [ ] Network tab → check API calls
  - [ ] API calls going to correct Render URL
  - [ ] Responses returning 200 OK

---

## Email Services (Postmark)

### Postmark Account

- [ ] Postmark account created
  - [ ] Account approved (may take 24 hours)
  - [ ] Server created

- [ ] Sender email verified
  - [ ] Email: `noreply@swiftdrop.co.ke` (or your domain)
  - [ ] Verification completed
  - [ ] Status: "Active"

- [ ] API token created and saved
  - [ ] Settings → API Tokens
  - [ ] Server API Token copied
  - [ ] Added to Render: `POSTMARK_API_TOKEN`

### Postmark Templates

- [ ] 8 templates created with correct aliases:
  - [ ] `swiftdrop-order-confirmation`
  - [ ] `swiftdrop-order-status-update`
  - [ ] `swiftdrop-service-request-created`
  - [ ] `swiftdrop-payment-receipt`
  - [ ] `swiftdrop-welcome`
  - [ ] `swiftdrop-runner-notification`
  - [ ] `swiftdrop-support-reply`
  - [ ] `swiftdrop-password-reset`

- [ ] Each template tested
  - [ ] Postmark dashboard → Templates → [Template Name] → Test
  - [ ] Test email sent successfully

### Postmark Testing

- [ ] Email test from backend
  ```bash
  cd backend
  TEST_EMAIL=your-email@example.com npm run test:email
  # Wait for email in inbox
  ```

---

## Auth Services (Supabase)

### Supabase Project

- [ ] Email provider configured
  - [ ] Settings → Auth → Providers → Email
  - [ ] Enable: "Confirm email"
  - [ ] Enable: "Send confirmation email"

- [ ] Redirect URLs configured
  - [ ] Add: `http://localhost:3000/auth/callback` (local dev)
  - [ ] Add: `https://[project-name].vercel.app/auth/callback` (production)

- [ ] Test email sending
  - [ ] Go to Supabase: Auth → Users
  - [ ] Select a user → Edit → Resend Confirmation Link
  - [ ] Check email for magic link

---

## End-to-End Testing

### User Registration Flow

- [ ] Visit production frontend URL
  ```
  https://[project].vercel.app
  ```

- [ ] Create new account
  - [ ] Click "Sign Up"
  - [ ] Enter unique email, name, phone
  - [ ] Click "Send OTP"
  - [ ] Check email for OTP code
  - [ ] Enter OTP → Should log in

- [ ] Welcome email received
  - [ ] Check email inbox for welcome email
  - [ ] Email from: `noreply@swiftdrop.co.ke` (or your domain)
  - [ ] Email contains welcome message

- [ ] User data in database
  - [ ] Render → Service → Shell
  - [ ] Verify user created:
    ```bash
    npm run prisma:studio
    # Or check database directly
    ```

### Error Handling

- [ ] Try invalid email format
  - [ ] Should show validation error
  - [ ] No server errors in Render logs

- [ ] Try duplicate registration
  - [ ] Should handle gracefully
  - [ ] Check Render logs for errors

---

## Monitoring & Logging

### Render Backend Monitoring

- [ ] Access Render dashboard
  - [ ] Service → Metrics (CPU, Memory, Disk)
  - [ ] Check for spikes or warnings
  - [ ] Logs showing healthy service

- [ ] Auto-restart enabled (default)
  - [ ] Service → Settings → Auto-retries
  - [ ] Should be enabled

### Vercel Frontend Monitoring

- [ ] Access Vercel dashboard
  - [ ] Project → Analytics
  - [ ] Check deployment success rate
  - [ ] Monitor Core Web Vitals

### Email Monitoring

- [ ] Postmark Activity log
  - [ ] Activity tab shows sent emails
  - [ ] No bounces or complaints
  - [ ] Delivery rate > 99%

---

## Custom Domain (Optional)

### Frontend Custom Domain (Vercel)

- [ ] Custom domain configured
  - [ ] Vercel → Project Settings → Domains
  - [ ] Add: `swiftdrop.co.ke` (or your domain)

- [ ] DNS records added to domain registrar
  - [ ] Type: CNAME
  - [ ] Name: `swiftdrop.co.ke`
  - [ ] Value: `cname.vercel-dns.com`

- [ ] SSL certificate verified
  - [ ] Vercel dashboard shows "Valid Configuration"
  - [ ] Access via: `https://swiftdrop.co.ke`

### Backend Custom Domain (Render)

- [ ] Custom domain configured (optional)
  - [ ] Render → Service Settings → Custom Domains
  - [ ] Add: `api.swiftdrop.co.ke`

- [ ] DNS CNAME record added
  - [ ] Updated Vercel `VITE_API_BASE_URL`
  - [ ] Changed from: `swiftdrop-api-xxxxx.onrender.com`
  - [ ] Changed to: `api.swiftdrop.co.ke`

- [ ] Tested new domain
  ```bash
  curl https://api.swiftdrop.co.ke/health
  ```

---

## Post-Deployment

### Documentation

- [ ] Deployment documentation updated
  - [ ] DEPLOYMENT.md
  - [ ] README.md points to deployment docs
  - [ ] Backend and Frontend readmes created

- [ ] Team access documented
  - [ ] Render access shared
  - [ ] Vercel access shared
  - [ ] Postmark account access shared
  - [ ] Supabase account access shared

### Backups & Disaster Recovery

- [ ] Database backups enabled
  - [ ] Render → Database → Backups
  - [ ] Check backup frequency

- [ ] GitHub as source of truth
  - [ ] All code committed
  - [ ] No secrets in GitHub (use .env)
  - [ ] Branch protection enabled (optional)

### Monitoring Setup

- [ ] Error tracking (optional)
  - [ ] Sentry or similar configured
  - [ ] Alerts set up

- [ ] Performance monitoring
  - [ ] Vercel Analytics enabled
  - [ ] Render Metrics checked regularly

- [ ] Email monitoring
  - [ ] Postmark Activity log reviewed daily
  - [ ] Bounce/complaint alerts set up

---

## Rollback Plan

In case of issues:

- [ ] Revert to previous GitHub commit
  ```bash
  git revert [commit-hash]
  git push origin main
  ```

- [ ] Render auto-redeploys from updated commit
- [ ] Vercel auto-redeploys from updated commit

- [ ] Or manually redeploy previous version
  - [ ] Render: Service → Deployments → Previous → Redeploy
  - [ ] Vercel: Deployments → Previous → Promote to Production

---

## Success Criteria

✅ **Deployment is successful when:**

1. Frontend loads at `https://[project].vercel.app`
2. Backend API responds at `https://[service].onrender.com/health`
3. User can register with email/OTP
4. Welcome email arrives in user inbox
5. No errors in Render or Vercel logs
6. Email test succeeds: `npm run test:email`
7. Database has user data

---

## Support & Troubleshooting

If issues arise, check in order:

1. **Render Logs**
   - Service → Logs
   - Look for error messages

2. **Vercel Logs**
   - Deployments → Latest → Logs
   - Check build output

3. **Browser Console (F12)**
   - Check for JavaScript errors
   - Check Network tab for failed requests

4. **Email Testing**
   ```bash
   cd backend
   TEST_EMAIL=test@example.com npm run test:email
   ```

5. **Documentation**
   - DEPLOYMENT.md (this directory)
   - RENDER_DEPLOYMENT.md (backend/)
   - VERCEL_DEPLOYMENT.md (root)

---

## 🎉 Deployment Complete!

Once all checkboxes are checked, SwiftDrop is successfully deployed to production!

### Post-Launch

- Monitor logs for first 24 hours
- Test all user flows
- Set up team notifications
- Plan weekly monitoring routine
- Schedule backup verification

### Future Deployments

For future updates, just:

```bash
git add .
git commit -m "feat: [feature description]"
git push origin main
# Render and Vercel auto-deploy!
```

---

**Last Updated:** May 5, 2026  
**Deployment Type:** Render + Vercel  
**Backend:** Node.js 18.17.0  
**Frontend:** React + Vite  
