// @ts-check

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
import { execSync } from 'child_process'

/**
 * @type {import('next').NextConfig}
 * */
const nextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    resolveAlias: {
      // Stub React Native async-storage (transitive from @reown/appkit-adapter-wagmi)
      '@react-native-async-storage/async-storage': '',
      // IPFS build: stub out styles.css import
      ...(process.env.NEXT_PUBLIC_IPFS
        ? { '../styles.css': './src/stub.css' }
        : {}),
    },
  },
  // Turbopack can't chunk @reown/appkit-scaffold-ui's dynamic imports through pnpm's
  // deep .pnpm store paths (3 duplicate installations). Transpiling resolves this.
  transpilePackages: ['@reown/appkit-scaffold-ui'],
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  // Expose git hash as build-time env var (replaces webpack DefinePlugin)
  env: {
    CONFIG_BUILD_ID: execSync('git rev-parse HEAD').toString().trim(),
  },
  images: {
    remotePatterns: [
      ...(process.env.NEXT_PUBLIC_METADATA_URL
        ? [{ protocol: /** @type {const} */ ('https'), hostname: new URL(process.env.NEXT_PUBLIC_METADATA_URL).hostname }]
        : []),
    ],
  },
  async headers() {
    // keep this in case we need to debug Safe in the future
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/manifest.json',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*',
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET, OPTIONS',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'X-Requested-With, content-type, Authorization',
            },
          ],
        },
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "frame-ancestors 'self' https://app.safe.global;",
            },
          ],
        },
      ]
    }
    return []
  },
  async rewrites() {
    return [
      {
        source: '/legacyFavourites',
        destination: '/legacyfavourites',
      },
      {
        source: '/my/profile',
        destination: '/profile?connected=true',
      },
      {
        source: '/names/:address',
        destination: '/my/names?address=:address',
      },
      {
        source: '/:address(0x[a-fA-F0-9]{40}$)',
        destination: '/address?address=:address',
      },
      {
        source: '/:name',
        destination: '/profile?name=:name',
      },
      {
        source: '/:name/register',
        destination: '/register?name=:name',
      },
      {
        source: '/:name/expired-profile',
        destination: '/profile?name=:name&expired=true',
      },
      {
        source: '/:name/import',
        destination: '/import?name=:name',
      },
      {
        source: '/:name/dotbox',
        destination: '/dotbox?name=:name',
      },
      {
        source: '/tld/:tld',
        destination: '/profile?name=:tld',
      },
      {
        source: '/tld/:tld/register',
        destination: '/register?name=:tld',
      },
      {
        source: '/tld/:tld/expired-profile',
        destination: '/profile?name=:tld&expired=true',
      },
      {
        source: '/tld/:tld/import',
        destination: '/import?name=:tld',
      },
    ]
  },
  generateBuildId: () => {
    const hash = execSync('git rev-parse HEAD').toString().trim()
    return hash
  },
  ...(process.env.NEXT_PUBLIC_IPFS
    ? {
        trailingSlash: true,
        assetPrefix: './',
      }
    : {}),
}

/**
 * @type {((config: import('next').NextConfig) => import('next').NextConfig)[]}
 */
const plugins = []

if (process.env.ANALYZE) {
  const withBundleAnalyzer = await import('@next/bundle-analyzer').then((n) => n.default)
  plugins.push(withBundleAnalyzer({ enabled: true }))
}

export default plugins.reduce((acc, next) => next(acc), nextConfig)
