# Frontend Deployment with Vercel

This guide covers deploying your SwiftDrop frontend to Vercel.

## Quick Start

### 1. Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Vercel auto-detects Vite configuration
5. Click "Deploy"

### 2. Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

```
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
```

**Guide for each:**

- **VITE_API_BASE_URL**: Your Render backend URL (e.g., `https://swiftdrop-api-xxxxx.onrender.com`)
- **VITE_SUPABASE_URL**: Found in Supabase project settings
- **VITE_SUPABASE_ANON_KEY**: Found in Supabase project settings → API

### 3. Set Production & Preview Environments

Click each variable's ⚙️ button to set which environments it applies to:
- Development environment (for local testing)
- Preview environment (for Pull Request previews)
- Production environment (for main branch)

**Recommended:**
- All three variables in **Production** ✅
- All three in **Preview** ✅
- All three in **Development** (optional) 🔄

### 4. Deploy

1. Save environment variables
2. Vercel auto-deploys your main branch
3. View live app at `https://your-project.vercel.app`

## Automatic Deployments

Vercel automatically deploys when you:
- ✅ Push to `main` branch → Deploy to production
- ✅ Create Pull Request → Deploy preview
- ✅ Push to PR branch → Update preview

## Build & Runtime

**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Node Version:** 18.x (auto-detected from `.nvmrc` or package.json)

## Environment Variables for Different Branches

You can set different API URLs for different deployments:

| Environment | Branch | API_BASE_URL |
|-------------|--------|--------------|
| Production | main | `https://api.swiftdrop.co.ke` |
| Preview | feature/* | `https://staging-api.swiftdrop.co.ke` |
| Development | local | `http://localhost:4000` |

Set in Vercel: Variable ⚙️ → Select which branches/environments to apply to

## Custom Domain

1. Go to Project Settings → Domains
2. Click "Add" → Add custom domain (e.g., `swiftdrop.co.ke`)
3. Add CNAME record to your DNS provider:
   ```
   CNAME swiftdrop.co.ke cname.vercel-dns.com
   ```
4. Wait for DNS propagation (usually instant)

## Monitoring & Logs

- **Deployments**: Project Home → "Deployments" tab
- **Live Logs**: Click a deployment → "Logs"
- **Analytics**: Project Home → "Analytics" tab
- **Performance**: See Core Web Vitals and page speed insights

## Troubleshooting

### Build Fails

Check build logs in Vercel dashboard. Common issues:

```bash
# Build locally first
npm run build

# Check for TypeScript errors
npm run type-check

# Clear and rebuild
npm ci
npm run build
```

### Environment Variables Not Loading

1. Verify variable names match `VITE_*` prefix
2. Ensure you've selected the correct environment (Production/Preview)
3. Redeploy after changing variables
4. Check browser console for undefined values

### API Requests Failing

```javascript
// Verify API URL in code
console.log('API:', import.meta.env.VITE_API_BASE_URL);

// Check CORS headers from Render
// Make sure Render allows your Vercel domain
```

### Missing Supabase Auth

Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in:
1. `.env.local` (local development)
2. Vercel dashboard (production/preview)

## Rollback

To rollback to a previous deployment:

1. Go to Deployments tab
2. Find the deployment you want to rollback to
3. Click the deployment
4. Click "Redeploy"

## Size & Performance

- **Build Size Limit**: 250MB (usually far less)
- **Function Timeout**: 60 seconds
- **Request Size**: 32MB limit

Monitor in Analytics tab for performance metrics.

## Resources

- [Vercel Vite Deployment](https://vercel.com/docs/frameworks/vite)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Vercel Domains](https://vercel.com/docs/concepts/projects/domains)

## Next Steps

1. ✅ Push to GitHub
2. ✅ Set up Vercel project
3. ✅ Add environment variables
4. ✅ Test preview deployment
5. ✅ Test production deployment
6. ✅ (Optional) Add custom domain
