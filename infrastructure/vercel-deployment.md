# ECNS Vercel Deployment Guide

Complete deployment guide for ECNS app and docs on Vercel.

## Overview

Vercel hosts two ECNS projects:

| Project | Domain | Repository | Purpose |
|---------|--------|------------|---------|
| ECNS App | app.ecns.domains | ecnsdomains/ecns-app | Domain registration app |
| ECNS Docs | docs.ecns.domains | ecnsdomains/ecnsjs | SDK documentation |

---

## Prerequisites

### 1. Vercel Account Setup

1. **Create/Access Vercel Account:**
   ```
   https://vercel.com/signup
   ```

2. **Create ECNS Organization (Optional):**
   - Dashboard → Add Team
   - Name: "ECNS" or "ECNS Domains"
   - Plan: Hobby (Free) or Pro ($20/month)

3. **Connect GitHub:**
   - Settings → Git Integrations
   - Connect GitHub account
   - Grant access to ecnsdomains organization

### 2. GitHub Repository Access

Ensure you have access to:
- https://github.com/ecnsdomains/ecns-app (app)
- https://github.com/ecnsdomains/ecnsjs (docs)

---

## Project 1: ECNS App Deployment

### Step 1: Import Project

1. **Go to Vercel Dashboard:**
   ```
   https://vercel.com/new
   ```

2. **Import Git Repository:**
   - Select "Import Git Repository"
   - Choose GitHub
   - Search for: `ecnsdomains/ecns-app`
   - Click "Import"

3. **Configure Project:**
   - Project Name: `ecns-app`
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (or `./app` if in monorepo)
   - Build Command: `pnpm build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `pnpm install`

### Step 2: Environment Variables

Add these environment variables for **Production**:

```bash
# Chain Configuration
NEXT_PUBLIC_CHAIN_NAME=etc
NEXT_PUBLIC_PROVIDER=https://etc.rivet.link
NEXT_PUBLIC_DOMAIN=ecns.domains

# Optional: Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=app.ecns.domains

# Optional: Graph Protocol (when available)
# NEXT_PUBLIC_GRAPH_URI=https://subgraph.ecns.domains/graphql
```

Add these for **Preview** (optional, for PR previews):

```bash
NEXT_PUBLIC_CHAIN_NAME=mordor
NEXT_PUBLIC_PROVIDER=https://rpc.mordor.etccooperative.org
NEXT_PUBLIC_DOMAIN=app-preview.vercel.app
```

**How to add:**
- Settings → Environment Variables
- Add each variable:
  - Key: `NEXT_PUBLIC_CHAIN_NAME`
  - Value: `etc`
  - Environment: Production, Preview, Development
- Click "Save"

### Step 3: Build Settings

Verify build settings in **Settings → General**:

| Setting | Value |
|---------|-------|
| Node.js Version | 24.x (LTS) |
| Package Manager | pnpm |
| Build Command | `pnpm build` |
| Output Directory | `.next` |
| Install Command | `pnpm install --frozen-lockfile` |

### Step 4: Deploy

1. **Trigger Deployment:**
   - Click "Deploy" button
   - Or push to `etc` branch on GitHub

2. **Monitor Build:**
   - Watch build logs in real-time
   - Build should complete in 2-5 minutes

3. **Verify Deployment:**
   - Check deployment URL: `https://ecns-app.vercel.app`
   - Test functionality (wallet connect, domain search)

### Step 5: Add Custom Domain

1. **Go to Settings → Domains:**
   - Click "Add Domain"
   - Enter: `app.ecns.domains`
   - Click "Add"

2. **DNS Configuration:**
   - Vercel will show DNS instructions
   - Add CNAME record in Cloudflare (see dns-configuration.md)
   - Wait for verification (5-10 minutes)

3. **Set as Production:**
   - Click three dots next to `app.ecns.domains`
   - Select "Set as Production Domain"

4. **Verify HTTPS:**
   - Should automatically provision SSL certificate
   - Status should show "Active" with green checkmark

5. **Test Custom Domain:**
   ```bash
   curl -I https://app.ecns.domains
   # Expected: HTTP/2 200 OK
   ```

### Step 6: Configure Git Integration

1. **Settings → Git:**
   - Production Branch: `etc`
   - Enable: "Automatically deploy commits"
   - Enable: "Preview deployments for all branches"

2. **Deploy Hooks (Optional):**
   - Settings → Git → Deploy Hooks
   - Create deploy hook for manual triggers:
     ```bash
     curl -X POST https://api.vercel.com/v1/integrations/deploy/[hook-id]
     ```

---

## Project 2: ECNS Docs Deployment

### Step 1: Import Docs Project

1. **Import Repository:**
   - Vercel Dashboard → New Project
   - Select `ecnsdomains/ecnsjs`
   - Click "Import"

2. **Configure Project:**
   - Project Name: `ecns-docs`
   - Framework Preset: Vite (docs uses Vocs)
   - Root Directory: `./docs` (if in monorepo)
   - Build Command: `pnpm build`
   - Output Directory: `.vocs/dist` (or `docs/.vocs/dist`)
   - Install Command: `pnpm install`

### Step 2: Environment Variables

Add for **Production**:

```bash
NEXT_PUBLIC_SITE_URL=https://docs.ecns.domains
NEXT_PUBLIC_APP_URL=https://app.ecns.domains
NEXT_PUBLIC_GITHUB_ORG=ecnsdomains
```

### Step 3: Build Settings

**Settings → General:**

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Root Directory | `./docs` |
| Build Command | `cd docs && pnpm build` |
| Output Directory | `docs/.vocs/dist` |

**Note:** Adjust paths if docs is not in a monorepo.

### Step 4: Deploy & Add Custom Domain

1. **Deploy:**
   - Click "Deploy"
   - Monitor build logs

2. **Add Custom Domain:**
   - Settings → Domains
   - Add: `docs.ecns.domains`
   - Set as Production Domain

3. **Verify:**
   ```bash
   curl -I https://docs.ecns.domains
   ```

---

## Advanced Configuration

### Edge Functions

The OG image generator uses Edge Runtime:

**Verify Edge Function:**
- Deployments → Functions
- Check `/api/og` is listed
- Runtime: Edge
- Region: All regions (global)

**Monitor Performance:**
- Functions tab shows:
  - Invocations count
  - Average duration
  - Errors (should be 0%)

### Edge Middleware (Optional)

For geo-routing or A/B testing:

**Create middleware.ts:**

```typescript
// app/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const country = request.geo?.country || 'US'

  // Example: Redirect based on country
  if (country === 'CN' && !request.nextUrl.pathname.startsWith('/zh')) {
    return NextResponse.redirect(new URL('/zh', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
```

### Analytics Integration

**Built-in Vercel Analytics:**

1. **Enable Web Analytics:**
   - Settings → Analytics
   - Toggle "Enable Web Analytics"
   - Free on Hobby plan

2. **Add Analytics Package:**
   ```bash
   pnpm add @vercel/analytics
   ```

3. **Update _app.tsx:**
   ```typescript
   import { Analytics } from '@vercel/analytics/react'

   export default function App({ Component, pageProps }) {
     return (
       <>
         <Component {...pageProps} />
         <Analytics />
       </>
     )
   }
   ```

**Speed Insights:**

```bash
pnpm add @vercel/speed-insights
```

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  )
}
```

### Security Headers

**Add to next.config.js:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

---

## Deployment Workflow

### Automatic Deployments

**Production (etc branch):**
```bash
git checkout etc
git add .
git commit -m "feature: add new feature"
git push origin etc
# Vercel automatically deploys to production
```

**Preview (feature branches):**
```bash
git checkout -b feature/new-feature
# Make changes
git push origin feature/new-feature
# Vercel creates preview deployment
# Preview URL: https://ecns-app-git-feature-new-feature.vercel.app
```

### Manual Deployments

**Via CLI:**

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**Via API:**

```bash
# Trigger deployment via webhook
curl -X POST https://api.vercel.com/v1/integrations/deploy/[hook-id]
```

---

## Monitoring & Debugging

### Real-time Logs

**View Function Logs:**
```bash
vercel logs ecns-app --follow
```

**Filter by deployment:**
```bash
vercel logs ecns-app --since 1h
```

### Error Tracking

**Built-in Error Tracking:**
- Deployments → [deployment] → Functions
- Click on function to see error logs

**Integration with Sentry (Optional):**

```bash
pnpm add @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV,
  tracesSampleRate: 1.0,
})
```

### Performance Monitoring

**Vercel Speed Insights:**
- Analytics → Speed Insights
- Shows:
  - Core Web Vitals (LCP, FID, CLS)
  - Real User Monitoring (RUM)
  - Performance score

**Lighthouse CI:**

```bash
# Run Lighthouse in CI
pnpm add -D @lhci/cli

# Configure lighthouse.rc.json
{
  "ci": {
    "collect": {
      "url": ["https://app.ecns.domains"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

---

## Rollback & Versioning

### Instant Rollback

**Via Dashboard:**
1. Deployments → Previous deployments
2. Click three dots → "Promote to Production"
3. Instant rollback (0 downtime)

**Via CLI:**
```bash
vercel rollback [deployment-url]
```

### Version Pinning

**Pin to specific deployment:**
1. Deployments → Select deployment
2. Settings → Promote to Production
3. All traffic routes to this version

---

## Cost Optimization

### Hobby Plan Limits (Free)

| Resource | Limit | Notes |
|----------|-------|-------|
| Deployments | Unlimited | - |
| Bandwidth | 100 GB/month | ~300K page views |
| Build Minutes | 6,000 min/month | ~200 builds |
| Function Invocations | Unlimited | Fair use policy |
| Concurrent Builds | 1 | One at a time |

### When to Upgrade to Pro ($20/month)

Upgrade if you exceed:
- ✗ 100 GB bandwidth/month
- ✗ Need priority support
- ✗ Need team collaboration features
- ✗ Need advanced analytics

**Pro Plan Benefits:**
- 1 TB bandwidth/month
- Concurrent builds
- Password protection
- Advanced analytics
- Commercial usage license

---

## Troubleshooting

### Build Fails with "Module not found"

**Cause:** Missing dependency or incorrect import path

**Fix:**
```bash
# Check package.json dependencies
pnpm install

# Clear Vercel cache
vercel --force

# Check import paths are correct
```

### Function Exceeds Timeout (10s on Hobby, 60s on Pro)

**Cause:** Long-running function or cold start

**Fix:**
- Optimize function code
- Use Edge Runtime instead of Node.js runtime
- Upgrade to Pro for 60s timeout
- Move heavy computation to background job

### Large Bundle Size (>1 MB)

**Cause:** Too many dependencies or unoptimized build

**Fix:**
```bash
# Analyze bundle
pnpm add -D @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# Run analysis
ANALYZE=true pnpm build
```

### 404 on Custom Domain

**Cause:** DNS not configured or not propagated

**Fix:**
1. Check Cloudflare CNAME: `dig app.ecns.domains CNAME +short`
2. Should return: `cname.vercel-dns.com`
3. Wait 5-10 minutes for propagation
4. Click "Refresh" in Vercel domains settings

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - etc

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Run tests
        run: pnpm test

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Required Secrets:**
- `VERCEL_TOKEN`: Vercel API token
- `VERCEL_ORG_ID`: Organization ID
- `VERCEL_PROJECT_ID`: Project ID

---

## Best Practices

### Performance

- ✓ Enable Image Optimization (`next/image`)
- ✓ Use Edge Runtime for API routes
- ✓ Implement code splitting
- ✓ Enable compression (automatic)
- ✓ Use static generation where possible

### Security

- ✓ Never commit `.env` files
- ✓ Use environment variables for secrets
- ✓ Enable security headers in `next.config.js`
- ✓ Keep dependencies updated
- ✓ Use CSP (Content Security Policy)

### Monitoring

- ✓ Enable Vercel Analytics
- ✓ Set up error tracking (Sentry)
- ✓ Monitor Core Web Vitals
- ✓ Set up uptime monitoring (UptimeRobot)
- ✓ Review deployment logs weekly

### Development

- ✓ Use preview deployments for testing
- ✓ Test on production-like environment
- ✓ Use feature flags for gradual rollout
- ✓ Tag releases with git tags
- ✓ Document breaking changes

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Vercel Analytics](https://vercel.com/analytics)

---

**Last Updated:** 2026-02-12
**Maintainer:** ECNS Development Team
