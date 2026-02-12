# OG Image Generator Examples

Real-world usage examples for ECNS dynamic OG image generation.

## Query Parameters Reference

| Parameter | Type | Default | Example |
|-----------|------|---------|---------|
| `domain` | string | - | `example.etc` |
| `title` | string | `"ECNS"` | `Register Now` |
| `subtitle` | string | `"Your web3 username on Ethereum Classic"` | `Fast, secure, decentralized` |
| `theme` | string | `"default"` | `minimal`, `profile` (future) |

---

## Use Case Examples

### 1. Homepage

**URL:**
```
https://ecns.domains/api/og
```

**Output:**
- ECNS geometric mark (large, centered)
- "ECNS" wordmark (68px, white)
- "Your web3 username on Ethereum Classic" subtitle
- ECNS gradient background
- "ECNS.DOMAINS" footer

**Usage in code:**
```tsx
// src/pages/index.tsx
<Head>
  <meta property="og:image" content="https://ecns.domains/api/og" />
  <meta name="twitter:image" content="https://ecns.domains/api/og" />
</Head>
```

---

### 2. Domain Profile Page

**URL:**
```
https://ecns.domains/api/og?domain=example.etc
```

**Output:**
- ECNS mark (smaller, top)
- "example.etc" (72px, prominent)
- "ECNS" wordmark (48px, secondary)
- Tagline + footer

**Usage in code:**
```tsx
// src/pages/profile/[name].tsx
import { useRouter } from 'next/router'

export default function DomainProfile() {
  const router = useRouter()
  const { name } = router.query
  const ogUrl = `https://ecns.domains/api/og?domain=${name}.etc`

  return (
    <Head>
      <meta property="og:title" content={`${name}.etc - ECNS`} />
      <meta property="og:image" content={ogUrl} />
    </Head>
  )
}
```

---

### 3. Register/Search Page

**URL:**
```
https://ecns.domains/api/og?title=Register%20Your%20Domain&subtitle=Claim%20your%20.etc%20domain%20on%20Ethereum%20Classic
```

**Output:**
- ECNS mark
- "Register Your Domain" title
- "Claim your .etc domain on Ethereum Classic" subtitle

**Usage in code:**
```tsx
// src/pages/register.tsx
const ogUrl = new URL('https://ecns.domains/api/og')
ogUrl.searchParams.set('title', 'Register Your Domain')
ogUrl.searchParams.set('subtitle', 'Claim your .etc domain on Ethereum Classic')

return (
  <Head>
    <meta property="og:image" content={ogUrl.toString()} />
  </Head>
)
```

---

### 4. About Page

**URL:**
```
https://ecns.domains/api/og?title=About%20ECNS&subtitle=Decentralized%20naming%20for%20Ethereum%20Classic
```

---

### 5. FAQ Page

**URL:**
```
https://ecns.domains/api/og?title=Frequently%20Asked%20Questions&subtitle=Everything%20you%20need%20to%20know%20about%20.etc%20domains
```

---

### 6. Mordor Testnet

**URL:**
```
https://ecns.domains/api/og?title=Mordor%20Testnet&subtitle=Test%20ECNS%20on%20Ethereum%20Classic%20testnet
```

**Usage in code:**
```tsx
// src/pages/mordor.tsx
<Head>
  <meta property="og:title" content="Mordor Testnet - ECNS" />
  <meta
    property="og:image"
    content="https://ecns.domains/api/og?title=Mordor%20Testnet&subtitle=Test%20ECNS%20on%20Ethereum%20Classic%20testnet"
  />
</Head>
```

---

## Advanced Examples

### 7. Domain with Special Characters

**URL:**
```
https://ecns.domains/api/og?domain=%E2%9C%A8sparkle%E2%9C%A8.etc
```

Handles Unicode domains: ✨sparkle✨.etc

---

### 8. Long Domain Names

**URL:**
```
https://ecns.domains/api/og?domain=this-is-a-very-long-domain-name-for-testing.etc
```

Automatically scales font size to fit.

---

### 9. Multi-line Subtitle

**URL:**
```
https://ecns.domains/api/og?title=ECNS%20v2&subtitle=New%20features%3A%20Subdomains%2C%20DNSSEC%2C%20Multi-chain
```

Supports newlines via encoding (`%0A`):
```
?subtitle=Line%201%0ALine%202%0ALine%203
```

---

## HTML Meta Tag Integration

### Complete meta tag setup for a domain profile page:

```html
<!-- Domain profile: example.etc -->
<head>
  <!-- Primary Meta Tags -->
  <title>example.etc - ECNS</title>
  <meta name="title" content="example.etc - ECNS" />
  <meta name="description" content="View and manage the example.etc domain on ECNS - Ethereum Classic Name Service" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="profile" />
  <meta property="og:url" content="https://ecns.domains/profile/example" />
  <meta property="og:title" content="example.etc - ECNS" />
  <meta property="og:description" content="View and manage the example.etc domain on ECNS - Ethereum Classic Name Service" />
  <meta property="og:image" content="https://ecns.domains/api/og?domain=example.etc" />
  <meta property="og:image:secure_url" content="https://ecns.domains/api/og?domain=example.etc" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="example.etc domain on ECNS" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://ecns.domains/profile/example" />
  <meta name="twitter:title" content="example.etc - ECNS" />
  <meta name="twitter:description" content="View and manage the example.etc domain on ECNS - Ethereum Classic Name Service" />
  <meta name="twitter:image" content="https://ecns.domains/api/og?domain=example.etc" />
  <meta name="twitter:image:alt" content="example.etc domain on ECNS" />
</head>
```

---

## React Component Example

Reusable component for OG meta tags:

```tsx
// src/components/OGMetaTags.tsx
import Head from 'next/head'

interface OGMetaTagsProps {
  title: string
  description: string
  url: string
  ogParams?: {
    domain?: string
    title?: string
    subtitle?: string
    theme?: string
  }
}

export function OGMetaTags({ title, description, url, ogParams }: OGMetaTagsProps) {
  const ogImageUrl = new URL('https://ecns.domains/api/og')

  if (ogParams) {
    Object.entries(ogParams).forEach(([key, value]) => {
      if (value) ogImageUrl.searchParams.set(key, value)
    })
  }

  return (
    <Head>
      {/* Primary */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* OG */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImageUrl.toString()} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl.toString()} />
    </Head>
  )
}
```

**Usage:**

```tsx
// Domain profile page
<OGMetaTags
  title="example.etc - ECNS"
  description="View and manage the example.etc domain"
  url="https://ecns.domains/profile/example"
  ogParams={{ domain: 'example.etc' }}
/>

// Register page
<OGMetaTags
  title="Register Domain - ECNS"
  description="Claim your .etc domain on Ethereum Classic"
  url="https://ecns.domains/register"
  ogParams={{
    title: 'Register Your Domain',
    subtitle: 'Claim your .etc domain on Ethereum Classic'
  }}
/>
```

---

## Testing Examples

### Local testing script:

```bash
#!/bin/bash
# test-og-images.sh

BASE_URL="http://localhost:3000/api/og"
OUTPUT_DIR="./og-test-outputs"

mkdir -p "$OUTPUT_DIR"

echo "Testing OG image generation..."

# Test 1: Default
curl "$BASE_URL" -o "$OUTPUT_DIR/01-default.png"
echo "✓ Default image"

# Test 2: Domain
curl "$BASE_URL?domain=example.etc" -o "$OUTPUT_DIR/02-domain.png"
echo "✓ Domain: example.etc"

# Test 3: Custom title
curl "$BASE_URL?title=Register%20Now" -o "$OUTPUT_DIR/03-custom-title.png"
echo "✓ Custom title"

# Test 4: Full customization
curl "$BASE_URL?domain=test.etc&title=ECNS&subtitle=Web3%20username" -o "$OUTPUT_DIR/04-full-custom.png"
echo "✓ Full customization"

# Test 5: Long domain
curl "$BASE_URL?domain=this-is-a-very-long-domain-name.etc" -o "$OUTPUT_DIR/05-long-domain.png"
echo "✓ Long domain"

# Test 6: Unicode
curl "$BASE_URL?domain=%E2%9C%A8sparkle%E2%9C%A8.etc" -o "$OUTPUT_DIR/06-unicode.png"
echo "✓ Unicode domain"

echo ""
echo "Generated images in $OUTPUT_DIR/"
open "$OUTPUT_DIR"
```

**Run:**
```bash
chmod +x test-og-images.sh
./test-og-images.sh
```

---

## Performance Benchmarks

### Cold start (first request):
```bash
time curl -o /dev/null -s -w "%{time_total}\n" "https://ecns.domains/api/og"
# Expected: 0.2-0.3 seconds
```

### Warm request (cached):
```bash
time curl -o /dev/null -s -w "%{time_total}\n" "https://ecns.domains/api/og?domain=example.etc"
# Expected: 0.05-0.1 seconds
```

### Batch generation:
```bash
for i in {1..10}; do
  curl "https://ecns.domains/api/og?domain=domain$i.etc" -o "/dev/null" -s -w "%{time_total}\n"
done | awk '{sum+=$1; count++} END {print "Average:", sum/count, "seconds"}'
```

---

## Social Media Preview Examples

### Twitter:
```
https://cards-dev.twitter.com/validator
```

**Test URLs:**
- Homepage: `https://ecns.domains`
- Domain: `https://ecns.domains/profile/example`
- Register: `https://ecns.domains/register`

### Facebook:
```
https://developers.facebook.com/tools/debug/
```

**Input URL:** `https://ecns.domains/profile/example`

**Expected:**
- Title: "example.etc - ECNS"
- Description: "View and manage the example.etc domain..."
- Image: Generated OG image with "example.etc" prominently displayed

### LinkedIn:
```
https://www.linkedin.com/post-inspector/
```

**Input URL:** `https://ecns.domains`

**Expected:**
- Title: "ECNS - Ethereum Classic Name Service"
- Description: "Your web3 username on Ethereum Classic"
- Image: Default ECNS branding

---

## Future Enhancements

### Planned features:

1. **Profile theme with stats:**
   ```
   /api/og?domain=example.etc&theme=profile
   ```
   Shows: domain, registration date, owner, resolver

2. **Chain-specific branding:**
   ```
   /api/og?domain=example.etc&chain=mordor
   ```
   Uses Mordor-specific colors/branding

3. **Animated GIFs:**
   ```
   /api/og?domain=example.etc&format=gif
   ```
   Subtle animation of ECNS mark

4. **Custom backgrounds:**
   ```
   /api/og?domain=example.etc&bg=gradient&color1=3FB68B&color2=1A3A2E
   ```

---

## Resources

- [Open Graph Protocol Specification](https://ogp.me/)
- [@vercel/og Documentation](https://vercel.com/docs/functions/og-image-generation)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ECNS Brand Guidelines](../../brand-guidelines/BRAND-GUIDELINES.md)
