# ECNS Dynamic OG Image Generator

Dynamic Open Graph image generation for ECNS domain pages using Next.js Edge API routes and `@vercel/og`.

## Features

- **Dynamic domain images**: Generate custom OG images for each `.etc` domain
- **Edge runtime**: Fast image generation using Vercel's Edge Runtime
- **Brand-consistent**: Uses ECNS colors, gradient, and geometric mark
- **Flexible**: Support for different themes and layouts
- **Zero dependencies**: No external image processing libraries needed

## Installation

Install the required dependency:

```bash
cd /media/dev/2tb/dev/ecns/app
pnpm add @vercel/og
```

## API Endpoint

**Endpoint:** `/api/og`

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `domain` | string | - | Domain name to display (e.g., `example.etc`) |
| `title` | string | `"ECNS"` | Main title text |
| `subtitle` | string | `"Your web3 username on Ethereum Classic"` | Subtitle/tagline |
| `theme` | string | `"default"` | Theme variant (future: minimal, profile) |

### Examples

**Homepage (default):**
```
https://ecns.domains/api/og
```
Generates: ECNS logo + "ECNS" title + tagline

**Domain profile:**
```
https://ecns.domains/api/og?domain=example.etc
```
Generates: ECNS logo + "example.etc" (large) + "ECNS" + tagline

**Custom title:**
```
https://ecns.domains/api/og?title=Claim%20Your%20Domain&subtitle=.etc%20domains%20on%20Ethereum%20Classic
```

**Search page:**
```
https://ecns.domains/api/og?title=Search%20Domains&subtitle=Find%20your%20perfect%20.etc%20domain
```

## Usage in Pages

### Dynamic OG images per domain

Update `_document.tsx` or individual pages to use dynamic OG images:

```tsx
// In pages/[name].tsx (domain profile pages)
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function DomainPage() {
  const router = useRouter()
  const { name } = router.query
  const domain = `${name}.etc`
  const ogImageUrl = `https://ecns.domains/api/og?domain=${encodeURIComponent(domain)}`

  return (
    <>
      <Head>
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
      {/* Page content */}
    </>
  )
}
```

### Pregenerated static images

For pages that don't change often, you can pregenerate OG images at build time:

```bash
# Generate static OG image for homepage
curl "http://localhost:3000/api/og" > public/og-homepage.png

# Generate for specific domain
curl "http://localhost:3000/api/og?domain=example.etc" > public/og-example-etc.png
```

## Deployment

### Vercel (Recommended)

The API route works out-of-the-box on Vercel:

1. Deploy app to Vercel: `vercel deploy`
2. Edge runtime automatically enabled for `/api/og`
3. Images cached at edge for fast delivery

### Self-hosted (Next.js standalone)

For self-hosted deployments:

```bash
# Build the app
pnpm build

# Start with Node.js
pnpm start
```

The API route will be available at `http://localhost:3000/api/og`

### Cloudflare Pages

To deploy on Cloudflare Pages:

1. Enable Next.js Edge Runtime support in `next.config.js`:
   ```js
   module.exports = {
     experimental: {
       runtime: 'experimental-edge',
     },
   }
   ```

2. Deploy via `@cloudflare/next-on-pages`:
   ```bash
   pnpm add -D @cloudflare/next-on-pages
   pnpm run pages:build
   ```

## Customization

### Add custom fonts

To use Satoshi font instead of system fonts:

1. Host Satoshi font files in `/public/fonts/`
2. Fetch font in API route:

```typescript
const satoshiFont = await fetch(
  new URL('../../public/fonts/sans-serif/Satoshi-Variable.woff', import.meta.url)
).then((res) => res.arrayBuffer())

return new ImageResponse(
  // ... JSX
  {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Satoshi',
        data: satoshiFont,
        weight: 800,
        style: 'normal',
      },
    ],
  }
)
```

### Add theme variants

Extend the `theme` parameter to support different layouts:

```typescript
const renderContent = () => {
  switch (theme) {
    case 'minimal':
      return <MinimalLayout domain={domain} />
    case 'profile':
      return <ProfileLayout domain={domain} title={title} />
    default:
      return <DefaultLayout domain={domain} title={title} subtitle={subtitle} />
  }
}
```

### Add chain-specific branding

Show different visuals for Mordor vs ETC mainnet:

```typescript
const chain = searchParams.get('chain') || 'mainnet' // mainnet | mordor

const chainColors = {
  mainnet: { bg: ECNS_GREEN, accent: ECNS_LIGHT },
  mordor: { bg: '#8B3F3F', accent: '#D44F4F' }, // Mordor red theme
}
```

## Performance

- **Cold start:** ~200-300ms on Vercel Edge
- **Cached:** ~50-100ms (served from CDN)
- **Image size:** ~15-25 KB (PNG, optimized)

## Debugging

### Local development

```bash
# Start dev server
pnpm dev

# Test OG image in browser
open http://localhost:3000/api/og?domain=test.etc
```

### Preview with social media debuggers

- **Twitter:** https://cards-dev.twitter.com/validator
- **Facebook:** https://developers.facebook.com/tools/debug/
- **LinkedIn:** https://www.linkedin.com/post-inspector/

### Common issues

**Error: "Failed to generate image"**
- Check console for detailed error logs
- Ensure `@vercel/og` is installed: `pnpm add @vercel/og`
- Verify Edge runtime is enabled in `api/og.tsx`

**Fonts not loading:**
- Fonts must be fetched as `arrayBuffer()` in Edge runtime
- Use absolute URLs or `import.meta.url` for font paths
- Fallback to system fonts if custom fonts fail

**Image not updating:**
- Clear CDN cache on Vercel: `vercel env pull` then redeploy
- Add cache-busting query param: `?domain=example.etc&v=2`
- Check browser DevTools Network tab for cached responses

## Resources

- [@vercel/og Documentation](https://vercel.com/docs/functions/og-image-generation)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ECNS Brand Guidelines](../brand-guidelines/BRAND-GUIDELINES.md)

## Future Enhancements

- [ ] Add Satoshi font loading (requires hosting font files)
- [ ] Create theme variants (minimal, profile, stats)
- [ ] Add chain-specific branding (Mordor vs mainnet)
- [ ] Generate favicons dynamically
- [ ] Add SVG export option
- [ ] Cache pregenerated images in R2/S3
- [ ] Add domain metadata (registration date, owner ENS)
- [ ] Support for animated GIFs (profile with stats)
