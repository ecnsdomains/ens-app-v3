import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

// Brand colors
const ECNS_GREEN = '#3FB68B'
const ECNS_DARK = '#1A3A2E'
const ECNS_LIGHT = '#4FD4A4'

// ECNS geometric mark SVG path
const ECNS_MARK_PATH =
  'M42.4734 1.5491C42.1294 1.02598 42.7618 0.413402 43.2749 0.772602L64.7575 15.8095C78.2972 25.2867 84.5315 42.208 80.2388 58.1544C79.8987 59.4177 79.5339 60.5235 79.1912 61.45C78.9787 62.0244 78.134 61.9004 78.0914 61.2895C77.7292 56.0972 73.9905 50.1611 71.2769 45.8527C70.7925 45.0835 70.3408 44.3663 69.9467 43.7144C67.3093 39.3512 48.2169 10.2849 42.4734 1.5491ZM14.0286 43.8411L39.7425 1.53062C40.0411 1.03949 39.5038 0.466613 38.9939 0.732504C34.4986 3.07609 22.3693 9.85687 12.8466 19.3674C2.41081 29.7898 10.8445 41.225 13.1082 43.9128C13.3584 44.2098 13.8269 44.1729 14.0286 43.8411ZM39.1069 92.8848C39.4509 93.4079 38.8185 94.0205 38.3054 93.6614L16.8228 78.6244C3.28314 69.1472 -2.95117 52.2259 1.34153 36.2795C1.68156 35.0162 2.04642 33.9104 2.38911 32.9839C2.6016 32.4095 3.44632 32.5335 3.48892 33.1444C3.85109 38.3366 7.58981 44.2728 10.3034 48.5812C10.7878 49.3503 11.2395 50.0676 11.6336 50.7195C14.271 55.0827 33.3634 84.149 39.1069 92.8848ZM41.8398 92.8988L67.5538 50.5883C67.7555 50.2566 68.224 50.2196 68.4742 50.5166C70.7379 53.2044 79.1716 64.6396 68.7358 75.062C59.2131 84.5725 47.0838 91.3533 42.5886 93.6969C42.0786 93.9628 41.5413 93.3899 41.8398 92.8988Z'

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  // Get parameters from query string
  const domain = searchParams.get('domain') // e.g., "example.etc"
  const title = searchParams.get('title') || 'ECNS'
  const subtitle =
    searchParams.get('subtitle') || 'Your web3 username on Ethereum Classic'
  const theme = searchParams.get('theme') || 'default' // default, minimal, profile

  try {
    // Load IBM Plex Mono font (would need to be hosted or use system fonts)
    // For now, using system fonts as fallback

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(330.4deg, ${ECNS_DARK} 4.54%, ${ECNS_GREEN} 59.2%, ${ECNS_LIGHT} 148.85%)`,
            position: 'relative',
          }}
        >
          {/* Subtle radial glow overlay */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at 50% 35%, rgba(79, 212, 164, 0.12), transparent)',
            }}
          />

          {/* Content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            {/* ECNS geometric mark */}
            <svg
              width="213"
              height="244"
              viewBox="0 0 82 94"
              style={{ marginBottom: 40, opacity: 0.95 }}
            >
              <path fillRule="evenodd" clipRule="evenodd" d={ECNS_MARK_PATH} fill="white" />
            </svg>

            {/* Domain name (if provided) - large and prominent */}
            {domain && (
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 800,
                  color: 'white',
                  letterSpacing: '-0.02em',
                  marginBottom: 20,
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {domain}
              </div>
            )}

            {/* Title (ECNS or custom) */}
            <div
              style={{
                fontSize: domain ? 48 : 68,
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-0.02em',
                marginBottom: 16,
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              {title}
            </div>

            {/* Subtitle/tagline */}
            <div
              style={{
                fontSize: 22,
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.80)',
                maxWidth: '80%',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              {subtitle}
            </div>

            {/* Domain footer */}
            <div
              style={{
                position: 'absolute',
                bottom: 40,
                fontSize: 16,
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.50)',
                letterSpacing: '0.08em',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              ECNS.DOMAINS
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
