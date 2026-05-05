# Render Backend Deployment

A `render.yaml` file (also called Blueprint) defines your backend deployment on Render.

## Setup Steps

1. **Create GitHub Connection**
   - Go to [render.com](https://render.com) and sign in
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select this repository

2. **Environment Variables**
   - Render will automatically detect and set up services from `render.yaml`
   - Go to your service → Settings → Environment
   - Add these variables:

   ```
   DATABASE_URL=postgresql://user:password@host:port/dbname
   POSTMARK_API_TOKEN=your-postmark-api-token
   POSTMARK_FROM_EMAIL=noreply@swiftdrop.co.ke
   POSTMARK_TEMPLATE_ALIAS_PREFIX=swiftdrop
   ADMIN_BYPASS_SECRET=your-admin-secret
   NODE_ENV=production
   ```

3. **Database Setup**
   - Create a PostgreSQL database on Render
   - Copy the internal connection string to `DATABASE_URL`
   - Run migrations: `prisma migrate deploy`

4. **Deploy**
   - Push to GitHub
   - Render automatically deploys from the main branch
   - Monitor in Render dashboard

## Environment Variables Reference

| Variable | Required | Example |
|----------|----------|---------|
| `DATABASE_URL` | ✅ | `postgresql://user:pass@localhost:5432/swiftdrop` |
| `PORT` | ❌ | `4000` (default) |
| `POSTMARK_API_TOKEN` | ✅ | Your Postmark API token |
| `POSTMARK_FROM_EMAIL` | ❌ | `noreply@swiftdrop.co.ke` |
| `POSTMARK_TEMPLATE_ALIAS_PREFIX` | ❌ | `swiftdrop` |
| `ADMIN_BYPASS_SECRET` | ✅ | Strong random string |
| `NODE_ENV` | ✅ | `production` |

## Health Check

Your API has a `/health` endpoint auto-configured in `render.yaml` for Render's health checks.

## Logs

View logs in Render dashboard:
- Deployment logs: Settings → Logs
- Live logs: Click service → Logs tab

## Troubleshooting

### Build fails with "npm: command not found"
- Ensure `Node.js Version` is set in render.yaml
- Render auto-detects from `.nvmrc` or uses default

### Database connection fails
- Verify `DATABASE_URL` uses the internal connection string (not external URL)
- Ensure database is in same region as service
- Check firewall rules allow Render IP

### Email not sending
- Verify `POSTMARK_API_TOKEN` is valid
- Check Postmark account is not in trial mode
- Verify sender email is whitelisted in Postmark

## Auto-Deploy on Push

Once set up, every GitHub push to `main` triggers automatic deployment. To skip deployment, add `[skip-render]` to commit message:

```bash
git commit -m "docs: Update README [skip-render]"
```

## Resources

- [Render Node.js Deployment](https://render.com/docs/deploy-node)
- [Render PostgreSQL](https://render.com/docs/databases)
- [Render Blueprints](https://render.com/docs/infrastructure-as-code)
