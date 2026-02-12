# OG Image Generator Integration Guide

How to integrate dynamic OG images into ECNS app pages.

## Installation

```bash
cd /media/dev/2tb/dev/ecns/app
pnpm add @vercel/og
```

## Step 1: Update Domain Profile Pages

For individual domain pages (e.g., `/profile/[name]`), add dynamic OG images:

### Option A: Using `getServerSideProps` (SSR)

```tsx
// src/pages/profile/[name].tsx
import { GetServerSideProps } from 'next'
import Head from 'next/head'

interface DomainPageProps {
  domain: string
  ogImageUrl: string
}

export default function DomainProfilePage({ domain, ogImageUrl }: DomainPageProps) {
  return (
    <>
      <Head>
        <title>{domain} - ECNS</title>
        <meta property="og:title" content={`${domain} - ECNS`} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>

      {/* Domain profile content */}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const name = params?.name as string
  const domain = `${name}.etc`
  const protocol = req.headers.host?.includes('localhost') ? 'http' : 'https'
  const host = req.headers.host
  const ogImageUrl = `${protocol}://${host}/api/og?domain=${encodeURIComponent(domain)}`

  return {
    props: {
      domain,
      ogImageUrl,
    },
  }
}
```

### Option B: Using `useRouter` (CSR)

```tsx
// src/pages/profile/[name].tsx
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useMemo } from 'react'

export default function DomainProfilePage() {
  const router = useRouter()
  const { name } = router.query

  const ogImageUrl = useMemo(() => {
    if (!name) return 'https://ecns.domains/og-image.png'
    const domain = `${name}.etc`
    return `https://ecns.domains/api/og?domain=${encodeURIComponent(domain)}`
  }, [name])

  return (
    <>
      <Head>
        <title>{name}.etc - ECNS</title>
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>

      {/* Domain profile content */}
    </>
  )
}
```

## Step 2: Update Search/Register Pages

Add contextual OG images for search and register flows:

```tsx
// src/pages/register.tsx
import Head from 'next/head'

export default function RegisterPage() {
  const ogImageUrl = 'https://ecns.domains/api/og?title=Register%20Your%20Domain&subtitle=Claim%20your%20.etc%20domain%20on%20Ethereum%20Classic'

  return (
    <>
      <Head>
        <title>Register Domain - ECNS</title>
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>

      {/* Register page content */}
    </>
  )
}
```

## Step 3: Update Global Meta Tags

Keep static OG image for homepage and fallback in `_document.tsx`:

```tsx
// src/pages/_document.tsx (existing file)

// Keep existing static OG image for homepage:
<meta property="og:image" content="https://ecns.domains/og-image.png" />

// This serves as fallback when individual pages don't override
```

Individual page `<Head>` tags will override the global meta tags from `_document.tsx`.

## Step 4: Add OG Image Preloading (Optional)

For better performance, preload OG images on page load:

```tsx
// src/pages/profile/[name].tsx
<Head>
  <link rel="preload" as="image" href={ogImageUrl} />
  <meta property="og:image" content={ogImageUrl} />
</Head>
```

## Step 5: Update Sitemap for Social Crawlers

Ensure social media bots can discover dynamic OG images:

```xml
<!-- public/sitemap.xml -->
<url>
  <loc>https://ecns.domains/profile/example</loc>
  <lastmod>2026-02-12</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
  <image:image>
    <image:loc>https://ecns.domains/api/og?domain=example.etc</image:loc>
    <image:title>example.etc - ECNS</image:title>
  </image:image>
</url>
```

## Testing

### 1. Local Testing

```bash
# Start dev server
pnpm dev

# Test in browser
open http://localhost:3000/api/og?domain=example.etc
```

### 2. Social Media Preview

Use social media card validators to test OG images:

- **Twitter:** https://cards-dev.twitter.com/validator
- **Facebook:** https://developers.facebook.com/tools/debug/
- **LinkedIn:** https://www.linkedin.com/post-inspector/

### 3. Automated Testing

Add E2E test for OG image generation:

```typescript
// e2e/og-image.spec.ts
import { test, expect } from '@playwright/test'

test('generates OG image for domain', async ({ page }) => {
  const response = await page.goto('/api/og?domain=example.etc')
  expect(response?.status()).toBe(200)
  expect(response?.headers()['content-type']).toBe('image/png')
})

test('domain page has correct OG meta tags', async ({ page }) => {
  await page.goto('/profile/example')

  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
  expect(ogImage).toContain('/api/og?domain=example.etc')
})
```

## Performance Optimization

### Edge Caching

Configure cache headers for faster delivery:

```typescript
// src/pages/api/og.tsx
export default async function handler(req: NextRequest) {
  // ... image generation logic

  return new ImageResponse(
    // ... JSX
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'CDN-Cache-Control': 'public, max-age=86400',
      },
    }
  )
}
```

### Pregenerate Static Images

For commonly viewed domains, pregenerate static images at build time:

```typescript
// scripts/pregenerate-og-images.ts
import { writeFileSync } from 'fs'
import { ImageResponse } from '@vercel/og'

const popularDomains = ['example', 'test', 'demo', 'wallet']

for (const name of popularDomains) {
  const domain = `${name}.etc`
  const image = await generateOGImage({ domain })
  writeFileSync(`public/og/${domain}.png`, image)
}
```

Add to `package.json`:

```json
{
  "scripts": {
    "prebuild": "tsx scripts/pregenerate-og-images.ts"
  }
}
```

## Troubleshooting

### OG image not showing on Twitter/Facebook

1. **Clear cache:** Use social media debuggers to refresh cached images
2. **Verify meta tags:** Check page source for correct OG image URL
3. **Test endpoint directly:** Visit `/api/og?domain=example.etc` in browser
4. **Check content-type:** Response should be `image/png`

### Image generation fails in production

1. **Check Edge runtime:** Ensure `export const config = { runtime: 'edge' }` is present
2. **Verify dependencies:** `@vercel/og` must be in `dependencies`, not `devDependencies`
3. **Check logs:** Review Vercel function logs for errors

### Fonts not rendering correctly

1. **Host fonts locally:** Place font files in `/public/fonts/`
2. **Use `arrayBuffer()`:** Fonts must be loaded as binary in Edge runtime
3. **Add fallback fonts:** Include system fonts in `fontFamily` CSS

## Next Steps

After integrating dynamic OG images:

1. Deploy to staging environment
2. Test with social media validators
3. Monitor Edge function performance in Vercel dashboard
4. Implement cache warming for popular domains
5. Add analytics to track OG image views
