# OG Image Generator Deployment Guide

Complete deployment instructions for ECNS dynamic OG image generation.

## Prerequisites

- Node.js 24.x (LTS)
- pnpm 10.x
- Git access to ECNS app repository

## Installation

### 1. Install Dependencies

```bash
cd /media/dev/2tb/dev/ecns/app
pnpm install
```

This installs `@vercel/og@^0.6.3` for Edge Runtime image generation.

### 2. Verify API Route

The API route is located at:
```
src/pages/api/og.tsx
```

Test locally:
```bash
pnpm dev

# In another terminal:
curl -I http://localhost:3000/api/og
# Should return: HTTP/1.1 200 OK
#                Content-Type: image/png
```

## Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel:**
- Native `@vercel/og` support
- Edge Runtime automatically configured
- Global CDN caching
- Zero configuration needed

**Steps:**

1. **Connect repository to Vercel:**
   ```bash
   # Install Vercel CLI
   pnpm add -g vercel

   # Login
   vercel login

   # Link project
   cd /media/dev/2tb/dev/ecns/app
   vercel link
   ```

2. **Configure environment variables:**
   ```bash
   # Set production domain
   vercel env add NEXT_PUBLIC_DOMAIN production
   # Value: ecns.domains
   ```

3. **Deploy:**
   ```bash
   # Preview deployment
   vercel

   # Production deployment
   vercel --prod
   ```

4. **Verify OG endpoint:**
   ```bash
   curl -I https://ecns.domains/api/og?domain=example.etc
   ```

**Vercel Configuration:**

Create `vercel.json` (optional, for custom caching):

```json
{
  "headers": [
    {
      "source": "/api/og",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400, stale-while-revalidate=31536000"
        }
      ]
    }
  ]
}
```

---

### Option 2: Cloudflare Pages

**Why Cloudflare Pages:**
- Free tier (100,000 requests/day)
- Global edge network
- Next.js Edge Runtime support

**Steps:**

1. **Install Cloudflare adapter:**
   ```bash
   cd /media/dev/2tb/dev/ecns/app
   pnpm add -D @cloudflare/next-on-pages
   ```

2. **Update `package.json` scripts:**
   ```json
   {
     "scripts": {
       "pages:build": "npx @cloudflare/next-on-pages",
       "pages:dev": "npx @cloudflare/next-on-pages --dev"
     }
   }
   ```

3. **Build for Cloudflare:**
   ```bash
   pnpm pages:build
   ```

4. **Deploy via Wrangler:**
   ```bash
   # Install Wrangler CLI
   pnpm add -g wrangler

   # Login to Cloudflare
   wrangler login

   # Deploy
   wrangler pages deploy .vercel/output/static
   ```

5. **Configure custom domain in Cloudflare dashboard:**
   - Go to Cloudflare Pages → Your project → Custom domains
   - Add `app.ecns.domains`

**Cloudflare Configuration:**

Create `wrangler.toml`:

```toml
name = "ecns-app"
compatibility_date = "2026-02-12"
pages_build_output_dir = ".vercel/output/static"

[build]
command = "pnpm pages:build"

[env.production]
vars = { NEXT_PUBLIC_DOMAIN = "ecns.domains" }
```

---

### Option 3: Self-Hosted (Docker)

**Why self-hosted:**
- Full control over infrastructure
- No vendor lock-in
- Cost-effective for high traffic

**Steps:**

1. **Create `Dockerfile`:**

```dockerfile
# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build app
RUN pnpm build

# Runtime stage
FROM node:24-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy built app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

2. **Update `next.config.js`:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Enable Docker deployment
  experimental: {
    // Enable Edge Runtime for OG images
    runtime: 'edge',
  },
}

module.exports = nextConfig
```

3. **Build and run:**

```bash
# Build image
docker build -t ecns-app:latest .

# Run container
docker run -d \
  --name ecns-app \
  -p 3000:3000 \
  -e NEXT_PUBLIC_DOMAIN=ecns.domains \
  ecns-app:latest
```

4. **Test OG endpoint:**

```bash
curl -I http://localhost:3000/api/og?domain=example.etc
```

5. **Deploy with docker-compose:**

Create `docker-compose.yml`:

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_DOMAIN=ecns.domains
      - NEXT_PUBLIC_CHAIN_NAME=etc
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
```

**Nginx Configuration (`nginx.conf`):**

```nginx
server {
    listen 80;
    server_name app.ecns.domains;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.ecns.domains;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # OG image caching
    location /api/og {
        proxy_pass http://app:3000;
        proxy_cache_valid 200 7d;
        proxy_cache_key "$request_uri";
        add_header X-Cache-Status $upstream_cache_status;
    }

    # All other requests
    location / {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Post-Deployment Validation

### 1. Test OG Image Generation

```bash
# Homepage (default)
curl -I https://ecns.domains/api/og
# Expected: 200 OK, Content-Type: image/png

# Domain profile
curl -I https://ecns.domains/api/og?domain=example.etc
# Expected: 200 OK, Content-Type: image/png

# Custom title
curl -I https://ecns.domains/api/og?title=Register%20Now
# Expected: 200 OK, Content-Type: image/png
```

### 2. Validate with Social Media

**Twitter Card Validator:**
```
https://cards-dev.twitter.com/validator
URL: https://ecns.domains/profile/example
```

**Facebook Debugger:**
```
https://developers.facebook.com/tools/debug/
URL: https://ecns.domains/profile/example
```

**LinkedIn Post Inspector:**
```
https://www.linkedin.com/post-inspector/
URL: https://ecns.domains/profile/example
```

### 3. Performance Monitoring

**Vercel:**
- Dashboard → Functions → `/api/og`
- Check invocation count, duration, errors

**Cloudflare:**
- Analytics → Workers → `ecns-app`
- Monitor requests, CPU time, errors

**Self-hosted:**
```bash
# Check logs
docker logs -f ecns-app

# Monitor resource usage
docker stats ecns-app
```

---

## Troubleshooting

### Issue: "Failed to generate image"

**Cause:** Missing `@vercel/og` dependency or Edge Runtime not enabled

**Fix:**
```bash
pnpm add @vercel/og
# Ensure src/pages/api/og.tsx has: export const config = { runtime: 'edge' }
```

---

### Issue: Fonts not rendering

**Cause:** Font files not accessible in Edge Runtime

**Fix:**
1. Host fonts in `/public/fonts/`
2. Load fonts as `arrayBuffer()` in API route
3. Add system font fallbacks in `fontFamily`

---

### Issue: OG images not updating on social media

**Cause:** Social media platforms cache OG images aggressively

**Fix:**
1. Clear cache using social media debugger tools
2. Add cache-busting query param: `?domain=example.etc&v=2`
3. Wait 24-48 hours for cache to expire naturally

---

### Issue: Slow OG image generation (>1s)

**Cause:** Cold start on serverless platforms

**Fix:**
1. **Vercel:** Upgrade to Pro plan for reserved instances
2. **Cloudflare:** Enable Smart Placement for auto-optimization
3. **Self-hosted:** Add nginx caching layer (see nginx.conf above)

---

## Monitoring & Analytics

### Track OG Image Views

Add analytics to API route:

```typescript
// src/pages/api/og.tsx
import { track } from '@/lib/analytics'

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const domain = searchParams.get('domain')

  // Track OG image generation
  await track('og_image_generated', {
    domain,
    timestamp: Date.now(),
  })

  // ... rest of handler
}
```

### Set up alerts

**Vercel:**
- Notifications → Functions → Alert on error rate >5%

**Cloudflare:**
- Notifications → Workers → Alert on failure rate >5%

**Self-hosted:**
```bash
# Prometheus metrics
wget http://localhost:3000/metrics

# Grafana dashboard
docker run -d -p 3001:3000 grafana/grafana
```

---

## Cost Estimation

### Vercel (Hobby Tier - Free)
- **Invocations:** 100,000/month included
- **Bandwidth:** 100 GB/month included
- **Cost:** $0/month (within limits)

### Vercel (Pro Tier - $20/month)
- **Invocations:** 1,000,000/month included
- **Bandwidth:** 1 TB/month included
- **Additional:** $0.60 per 100K invocations

### Cloudflare Pages (Free Tier)
- **Requests:** 100,000/day
- **Bandwidth:** Unlimited
- **Cost:** $0/month

### Self-Hosted (VPS)
- **Hetzner CPX21:** €7.59/month (3 vCPU, 4GB RAM)
- **DigitalOcean Droplet:** $12/month (2 vCPU, 2GB RAM)
- **Cost:** ~$10/month + domain

---

## Next Steps

1. Choose deployment platform (recommend: Vercel for simplicity)
2. Deploy OG image generator
3. Update domain pages to use dynamic OG images (see INTEGRATION.md)
4. Test with social media validators
5. Monitor performance and costs
6. Set up alerts for errors
