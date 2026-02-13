# ECNS Brand Assets

```
        /\
       /  \
      / :: \              ____   ___  _  _  ___
     / :::: \            / ___) / __)( \/ )/ __)
    / :::::: \          ( (___ ( (__ |    |\__  \
   / :::::::: \          \____) \___)|_\/\_)(___/
  /============\
  \ %%%%%%%%%% /          Ethereum Classic Name Service
   \ %%%%%%%% /
    \ %%%%%% /            > register yourname.etc
     \ %%%% /             > resolve  0x1234...abcd
      \ %% /
       \/                 https://ecns.domains
```

---

## Brand Identity: Cypherpunk Terminal

ECNS leans into the **retro terminal / early internet / cypherpunk** aesthetic. Registering an `.etc` name should feel like setting your IRC handle, generating a PGP key, or logging into a BBS for the first time.

Ethereum Classic is the original chain. The brand should feel like the original internet.

| Element | Description |
|---------|-------------|
| **Mark** | ETC Diamond Prism (faceted 3D rhombus, 8 faces) |
| **Wordmark** | Lowercase `ecns` in IBM 3270 monospace |
| **Tagline** | `> register yourname.etc` |
| **Colors** | Green phosphor on dark CRT |
| **Font** | IBM 3270 (1970s mainframe terminal) |
| **ASCII Mark** | Diamond in box-drawing / Unicode block characters |

### The Diamond Prism

The mark is a tall, vertically-oriented diamond (rhombus) inspired by the classic ETC/ETH diamond logo. It has **8 faceted faces** — 3 left, 3 right, plus top cap highlight and bottom cap shadow — creating true 3D depth through graduated shading:

```
      /\          Upper-left:   #4FD4A4 (brightest)     LEFT = BRIGHT
     / :\         Upper-right:  #2E9E76 (mid-dark)      RIGHT = DARK
    / :: \        Band-left:    #3FB68B (primary)
   /======\       Band-right:   #1A6B50 (deep)
   \ %%%% /       Lower-left:   #2E9E76 (dark)
    \ %% /        Lower-right:  #0D3D2E (shadow)
     \/           + Top cap:    #4FD4A4 @ 15% opacity
                  + Bottom cap: #0D3D2E @ 30% opacity
```

Light source is upper-left. LEFT faces are always brighter, RIGHT faces always darker. The equator band creates the signature ETC "waistband" that distinguishes it from generic diamond shapes.

### Cultural References

- IRC `/nick` commands — claiming your identity
- PGP key signing — cryptographic identity verification
- BBS door screens — ASCII art welcome banners
- DOS `command.com` — the raw interface
- Cypherpunk mailing lists — where crypto identity started

---

## Directory Structure

```
brand/
├── logos/
│   ├── icon.svg                  # Outline mark only (stroked diamond)
│   ├── icon-solid.svg            # Solid 8-face diamond (small sizes)
│   ├── wordmark-horizontal.svg   # Diamond + "ecns" (green #3FB68B)
│   ├── wordmark-light.svg        # Diamond + "ecns" (white #FFFFFF)
│   ├── wordmark-animated.svg     # Diamond + "ecns" with draw-on animation
│   ├── etc.svg                   # ETC logo
│   ├── ethereum-classic-mainnet.svg  # Network logo
│   ├── mordor-testnet.svg        # Mordor testnet logo
│   └── wetc.svg                  # Wrapped ETC logo
├── social/
│   ├── og-image.svg              # 1200x630 Open Graph card (dark terminal bg)
│   ├── og-image.png              # 1200x630 rasterized
│   ├── twitter-card.svg          # 1200x675 Twitter/X card (dark terminal bg)
│   └── twitter-card.png          # 1200x675 rasterized
├── favicons/
│   ├── favicon.svg               # SVG favicon (diamond mark only)
│   ├── favicon-16x16.png         # 16px PNG
│   ├── favicon-32x32.png         # 32px PNG
│   ├── favicon-48x48.png         # 48px PNG
│   ├── apple-touch-icon.svg      # 180x180 SVG (diamond on dark bg, rounded)
│   ├── apple-touch-icon-light.svg # 180x180 SVG (diamond on light bg)
│   ├── apple-touch-icon.png      # 180x180 PNG rasterized
│   ├── android-chrome-144x144.png # Android 144px
│   ├── android-chrome-192x192.png # Android 192px
│   ├── android-chrome-512x512.png # Android 512px
│   ├── mstile-70x70.png          # Windows tile 70px
│   ├── mstile-144x144.png        # Windows tile 144px
│   ├── mstile-150x150.png        # Windows tile 150px
│   ├── mstile-310x150.png        # Windows tile wide
│   └── mstile-310x310.png        # Windows tile large
└── ascii/
    ├── diamond.txt               # ASCII art mark (: and % chars)
    ├── diamond-unicode.txt       # Unicode block art mark (░▓)
    ├── banner.txt                # Diamond + lettering + commands
    └── banner-small.txt          # Compact 9-line banner
```

---

## Asset Catalog

### Logos

| Asset | File | Color | Usage |
|-------|------|-------|-------|
| Icon (outline) | `logos/icon.svg` | `#3FB68B` stroke | Standalone mark, small contexts |
| Icon (solid) | `logos/icon-solid.svg` | 8-face gradient fills | Favicons, very small contexts |
| Wordmark | `logos/wordmark-horizontal.svg` | `#3FB68B` | Headers, light backgrounds |
| Wordmark (light) | `logos/wordmark-light.svg` | `#FFFFFF` (opacity-based depth) | Dark backgrounds |
| Wordmark (animated) | `logos/wordmark-animated.svg` | `#3FB68B` | Hero sections, splash screens |
| ETC Logo | `logos/etc.svg` | — | Chain identity |
| ETC Mainnet | `logos/ethereum-classic-mainnet.svg` | — | Network selector |
| Mordor Testnet | `logos/mordor-testnet.svg` | — | Testnet indicator |
| WETC | `logos/wetc.svg` | — | Wrapped ETC token |

All wordmark text is converted to `<path>` outlines — no font dependency at render time.

### Social Cards

| Asset | File | Dimensions | Content |
|-------|------|-----------|---------|
| Open Graph | `social/og-image.svg` | 1200x630 | Dark terminal bg + ASCII art diamond + vector prism + ecns wordmark |
| Twitter/X | `social/twitter-card.svg` | 1200x675 | Same treatment, Twitter aspect ratio |

Social cards use a **dark terminal background** (`#0F1A15`) with ASCII art rendered behind the vector diamond prism mark. CRT scanline overlay, terminal prompt tagline, and subtle bottom accent line.

### Favicons

| Asset | File | Size |
|-------|------|------|
| SVG favicon | `favicons/favicon.svg` | Scalable (viewBox 80x100) |
| PNG 16px | `favicons/favicon-16x16.png` | 16px wide |
| PNG 32px | `favicons/favicon-32x32.png` | 32px wide |
| PNG 48px | `favicons/favicon-48x48.png` | 48px wide |
| Apple Touch | `favicons/apple-touch-icon.png` | 180x180 |
| Apple Touch (light) | `favicons/apple-touch-icon-light.svg` | 180x180 SVG |
| Android Chrome 192 | `favicons/android-chrome-192x192.png` | 192x192 |
| Android Chrome 512 | `favicons/android-chrome-512x512.png` | 512x512 |

### ASCII Art

| Asset | File | Style | Usage |
|-------|------|-------|-------|
| Diamond (ASCII) | `ascii/diamond.txt` | `:` light faces, `%` dark faces | READMEs, code blocks |
| Diamond (Unicode) | `ascii/diamond-unicode.txt` | `░` light, `▓` dark | Terminals with Unicode |
| Banner | `ascii/banner.txt` | Diamond + FIGlet lettering + commands | Splash screens, headers |
| Banner (compact) | `ascii/banner-small.txt` | 9-line compact | README headers, CLI output |

---

## Brand Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Light Phosphor | `#4FD4A4` | 79, 212, 164 | Brightest face, hover states |
| Green Phosphor | `#3FB68B` | 63, 182, 139 | Primary — logo, UI accents |
| Dark Accent | `#2E9E76` | 46, 158, 118 | Mid-dark face, pressed states |
| Deep Green | `#1A6B50` | 26, 107, 80 | Deep face, right-side depth |
| Shadow Green | `#0D3D2E` | 13, 61, 46 | Darkest face, base silhouette |
| Icon Dark | `#1C1C1E` | 28, 28, 30 | Favicon bg, neutral dark |
| Terminal Black | `#0F1A15` | 15, 26, 21 | Social card bg, deep black |

### Diamond Face Color Mapping

```
Face            Color     Side    Role
──────────────────────────────────────────────
Upper-left      #4FD4A4   LEFT    Brightest face
Band-left       #3FB68B   LEFT    Primary brand color
Lower-left      #2E9E76   LEFT    Dark accent
Upper-right     #2E9E76   RIGHT   Mid-dark
Band-right      #1A6B50   RIGHT   Deep green
Lower-right     #0D3D2E   RIGHT   Darkest face
Top cap         #4FD4A4   —       Highlight @ 15% opacity
Bottom cap      #0D3D2E   —       Shadow @ 30% opacity
```

---

## Typography

### Primary: IBM 3270

The IBM 3270 font recreates the character set of the 1970s IBM 3270 mainframe terminal. It is used for the wordmark and brand typography.

- **Wordmark:** Lowercase `ecns`, letter-spacing `0.02em`
- **Tagline:** `> register yourname.etc` (terminal prompt style)
- **Style:** Always lowercase for brand text
- **Fallback stack:** `'IBM 3270', VT323, 'Courier New', monospace`

All SVG wordmarks have text converted to `<path>` outlines via Inkscape, so the font is not required at render time. The font metadata is preserved in `aria-label` and `style` attributes for documentation.

### Installed Retro Fonts

These are installed on the development machine and available for UI theming:

| Font | Era | Character |
|------|-----|-----------|
| IBM 3270 | 1970s mainframe | Primary — elegant, legible |
| VT323 | 1980s DEC VT320 | Pixelated CRT look |
| Perfect DOS VGA 437 | MS-DOS system font | Peak command.com nostalgia |
| Glass TTY VT220 | DEC VT220 | Rounded phosphor glow |
| Terminus (Nerd Font) | Linux bitmap | Clean programmer favorite |

---

## Mark Geometry

The ETC Diamond Prism uses a viewBox of `0 0 80 100` with these vertices:

| Point | Coordinates |
|-------|-------------|
| Top | (40, 2) |
| Left equator | (10, 50) |
| Right equator | (70, 50) |
| Bottom | (40, 98) |
| Band top | (40, 42) |
| Band bottom | (40, 58) |

Wordmark SVGs use viewBox `0 0 216 100` with the diamond at left and `ecns` path outlines positioned via `<g transform="translate(-30, 0)">`.

---

## Usage Guidelines

### Logo Variants

- **Light backgrounds:** Use green logos (`#3FB68B`)
- **Dark backgrounds:** Use white logos (`wordmark-light.svg`)
- **Social/OG contexts:** Dark terminal background with vector diamond
- **Small contexts** (< 48px): Use `icon-solid.svg` (no wordmark)
- **Terminal/code contexts:** Use ASCII art from `ascii/`

### Clear Space

Minimum clear space around the logo equals the height of the lowercase `e` in the wordmark (~10px at default size).

### Do Not

1. Use uppercase "ECNS" in the wordmark (always lowercase `ecns`)
2. Use a sans-serif or proportional font for brand text
3. Rotate, stretch, or distort the mark
4. Change colors to non-brand values
5. Add drop shadows, glows, or outlines
6. Place on busy backgrounds without sufficient contrast
7. Use a flat hexagon — the mark is always a tall 3D diamond prism

---

## Regenerating PNGs

All PNGs are generated from SVG sources using Inkscape. SVGs are the source of truth.

```bash
cd /media/dev/2tb/dev/ecns/app/public/brand

# Favicons (diamond is 4:5 ratio, renders with natural proportions)
inkscape favicons/favicon.svg --export-type=png --export-filename=favicons/favicon-16x16.png --export-width=16
inkscape favicons/favicon.svg --export-type=png --export-filename=favicons/favicon-32x32.png --export-width=32
inkscape favicons/favicon.svg --export-type=png --export-filename=favicons/favicon-48x48.png --export-width=48

# Apple Touch Icon (180x180 square, diamond on dark bg)
inkscape favicons/apple-touch-icon.svg --export-type=png --export-filename=favicons/apple-touch-icon.png --export-width=180 --export-height=180

# Android Chrome icons (square, from apple-touch-icon source)
inkscape favicons/apple-touch-icon.svg --export-type=png --export-filename=favicons/android-chrome-192x192.png --export-width=192 --export-height=192
inkscape favicons/apple-touch-icon.svg --export-type=png --export-filename=favicons/android-chrome-512x512.png --export-width=512 --export-height=512

# Social cards
inkscape social/og-image.svg --export-type=png --export-filename=social/og-image.png --export-width=1200 --export-height=630
inkscape social/twitter-card.svg --export-type=png --export-filename=social/twitter-card.png --export-width=1200 --export-height=675

# Multi-resolution favicon.ico
convert favicons/favicon-16x16.png favicons/favicon-32x32.png favicons/favicon-48x48.png ../../favicon.ico

# Root copies
cp favicons/favicon-16x16.png ../../favicon-16x16.png
cp favicons/favicon-32x32.png ../../favicon-32x32.png
cp favicons/apple-touch-icon.png ../../apple-touch-icon.png
cp social/og-image.png ../../og-image.png
```

---

## Integration

### HTML Head (configured in `_document.tsx`)

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<meta property="og:image" content="https://ecns.domains/og-image.png" />
<meta name="twitter:image" content="https://ecns.domains/og-image.png" />
```

### React Components (configured in app)

```tsx
import ECNSMark from '../assets/ECNSMark.svg'           // Diamond + wordmark (homepage)
import ECNSMarkGradient from '../assets/ECNSMarkGradient.svg'  // Gradient diamond (inner pages)
```

---

### Favicon Backgrounds

| Context | Background | Hex |
|---------|-----------|-----|
| Dark theme / default | Dark gray | `#1C1C1E` |
| Light theme / iOS light | Off-white | `#F5F5F0` |
| Social cards | Terminal black | `#0F1A15` |

---

*ECNS Brand Assets v3.1 | February 2026 | 8-Face Diamond Prism + Cypherpunk Terminal Identity*
