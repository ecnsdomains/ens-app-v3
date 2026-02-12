# ECNS Brand Assets

Organized visual identity assets for the Ethereum Classic Name Service.

For complete brand standards, see `/media/dev/2tb/dev/ecns/brand-guidelines/BRAND-GUIDELINES.md`.

---

## Directory Structure

```
brand/
├── logos/
│   ├── icon.svg                  # Geometric mark only (82x94 viewBox)
│   ├── wordmark-horizontal.svg   # Mark + "ECNS" text, green (#3FB68B)
│   └── wordmark-light.svg        # Mark + "ECNS" text, white (#FFFFFF)
├── social/
│   ├── twitter-card.svg          # 1200x675 Twitter/X card
│   ├── twitter-card.png          # 1200x675 rasterized
│   ├── og-image.svg              # 1200x630 Open Graph image
│   └── og-image.png              # 1200x630 rasterized
└── favicons/
    ├── favicon.svg               # SVG favicon (94x94 viewBox)
    ├── favicon-16.png            # 16x16 PNG
    ├── favicon-32.png            # 32x32 PNG
    ├── favicon-48.png            # 48x48 PNG
    ├── apple-touch-icon.svg      # 180x180 SVG with dark bg
    └── apple-touch-icon.png      # 180x180 PNG rasterized
```

---

## Asset Catalog

### Logos

| Asset | File | Dimensions | Color | Usage |
|-------|------|-----------|-------|-------|
| Icon (mark only) | `logos/icon.svg` | 82x94 viewBox | `#3FB68B` | App icons, small contexts, standalone mark |
| Wordmark horizontal | `logos/wordmark-horizontal.svg` | 360x94 viewBox | `#3FB68B` | Website headers, light backgrounds |
| Wordmark light | `logos/wordmark-light.svg` | 360x94 viewBox | `#FFFFFF` | Dark backgrounds, gradient backgrounds |

### Social Media

| Asset | File | Dimensions | Format | Usage |
|-------|------|-----------|--------|-------|
| Twitter/X card | `social/twitter-card.svg` | 1200x675 | SVG + PNG | Twitter summary_large_image cards |
| Open Graph image | `social/og-image.svg` | 1200x630 | SVG + PNG | Facebook, LinkedIn, Discord previews |

### Favicons

| Asset | File | Dimensions | Format | Usage |
|-------|------|-----------|--------|-------|
| SVG favicon | `favicons/favicon.svg` | 94x94 viewBox | SVG | Modern browsers (scalable) |
| Favicon 16px | `favicons/favicon-16.png` | 16x16 | PNG | Browser tab icon (standard) |
| Favicon 32px | `favicons/favicon-32.png` | 32x32 | PNG | Browser tab icon (Retina) |
| Favicon 48px | `favicons/favicon-48.png` | 48x48 | PNG | Windows taskbar, shortcuts |
| Apple Touch Icon | `favicons/apple-touch-icon.png` | 180x180 | PNG | iOS home screen bookmark |

---

## Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| ECNS Green (Primary) | `#3FB68B` | Logo, buttons, links, accents |
| ECNS Dark | `#1A3A2E` | Dark backgrounds, text |
| ECNS Light | `#4FD4A4` | Hover states, secondary accents |

**Gradient:**
```css
linear-gradient(330.4deg, #1A3A2E 4.54%, #3FB68B 59.2%, #4FD4A4 148.85%)
```

---

## Usage Guidelines

### Logo Variants

- **Light backgrounds** (white, `#F7F7F7`): Use green logos (`#3FB68B`)
- **Dark backgrounds** (`#1A3A2E`, black): Use white logos (`wordmark-light.svg`)
- **Gradient backgrounds**: Use white logos
- **Small contexts** (< 60px wide): Use `icon.svg` only, wordmark becomes illegible

### Clear Space

Minimum clear space around the logo equals the height of the "e" in the wordmark (approximately 10px at default size on all sides).

### Do Not

1. Rotate the logo
2. Stretch or distort (always scale proportionally)
3. Change colors to non-brand values
4. Add drop shadows, glows, or outlines
5. Place on busy backgrounds without sufficient contrast
6. Crop any part of the mark

---

## Export New Sizes

PNG exports from SVG sources using Inkscape:

```bash
# Favicon at custom size
inkscape favicons/favicon.svg --export-type=png \
  --export-filename=output.png \
  --export-width=64 --export-height=64

# Social image at custom size
inkscape social/og-image.svg --export-type=png \
  --export-filename=output.png \
  --export-width=2400 --export-height=1260

# Icon at multiple densities
for scale in 1 2 3; do
  size=$((48 * scale))
  inkscape logos/icon.svg --export-type=png \
    --export-filename="icon-${size}.png" \
    --export-width=$size --export-height=$size
done
```

**Note:** Social SVGs reference the Satoshi font via `@font-face`. When rasterizing with Inkscape, the font may fall back to a system sans-serif. For pixel-perfect PNG output with Satoshi, use a browser-based renderer or export from a design tool with the font installed.

---

## Integration

### HTML Head (already configured in `_document.tsx`)

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<meta property="og:image" content="https://ecns.domains/og-image.png" />
<meta name="twitter:image" content="https://ecns.domains/og-image.png" />
```

### Manifest (manifest.json)

```json
{
  "icons": [
    { "src": "/brand/favicons/favicon-48.png", "sizes": "48x48", "type": "image/png" },
    { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## Source Files

All SVGs are the source of truth. PNG files are generated exports. To regenerate PNGs:

```bash
cd /media/dev/2tb/dev/ecns/app/public/brand

# Favicons
inkscape favicons/favicon.svg --export-type=png --export-filename=favicons/favicon-16.png --export-width=16 --export-height=16
inkscape favicons/favicon.svg --export-type=png --export-filename=favicons/favicon-32.png --export-width=32 --export-height=32
inkscape favicons/favicon.svg --export-type=png --export-filename=favicons/favicon-48.png --export-width=48 --export-height=48
inkscape favicons/apple-touch-icon.svg --export-type=png --export-filename=favicons/apple-touch-icon.png --export-width=180 --export-height=180

# Social
inkscape social/og-image.svg --export-type=png --export-filename=social/og-image.png --export-width=1200 --export-height=630
inkscape social/twitter-card.svg --export-type=png --export-filename=social/twitter-card.png --export-width=1200 --export-height=675
```

---

*ECNS Brand Assets v1.0 | February 2026 | White B0x Inc.*
*Full guidelines: /media/dev/2tb/dev/ecns/brand-guidelines/BRAND-GUIDELINES.md*
