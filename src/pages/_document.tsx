/* eslint-disable react/no-danger */
import { AppPropsType, AppType } from 'next/dist/shared/lib/utils'
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

import { cspWithoutFrameAncestors } from '@app/utils/createCsp'

const ipfsPathScript = `
  (function () {
    const { pathname } = window.location
    const ipfsMatch = /.*\\/Qm\\w{44}\\//.exec(pathname)
    const base = document.createElement('base')

    base.href = ipfsMatch ? ipfsMatch[0] : '/'
    document.head.append(base)
  })();
`

// sha256-UyYcl+sKCF/ROFZPHBlozJrndwfNiC5KT5ZZfup/pPc=
const hiddenCheckScript = `
  if (document.prerendering) {
    document.addEventListener('prerenderingchange', () => {
      if (typeof window.ethereum !== 'undefined') {
        window.location.reload()
      }
    }, {
      once: true,
    })
  } else if (document.hidden || document.visibilityState === 'hidden') {
    document.addEventListener('visibilitychange', () => {
      if (typeof window.ethereum !== 'undefined') {
        window.location.reload()
      }
    }, {
      once: true,
    })
  }
`

// sha256-84jekTLuMPFFzbBxEFpoUhJbu81z5uBinvhIKKkAPxg=
const themeSwitcherScript = `
  (function () {
    function setTheme(newTheme) {
        document.documentElement.setAttribute('data-theme', newTheme);
        window.__theme = newTheme;
        window.__onThemeChange(newTheme);
    }
    window.__onThemeChange = function () {};
    window.__setPreferredTheme = function (newTheme) {
        setTheme(newTheme);
        try {
            localStorage.setItem("theme", JSON.stringify(window.__theme));
        } catch (err) {}
    };

    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkQuery.addListener(function (event) {
        window.__setPreferredTheme(event.matches ? "dark" : "light");
    });

    let preferredTheme;
    try {
        preferredTheme = JSON.parse(localStorage.getItem("theme"));
    } catch (err) {}
    
    setTheme(preferredTheme || (darkQuery.matches ? "dark" : "light"));
  })();
`

const makeIPFSURL = (url: string) => {
  if (process.env.NEXT_PUBLIC_IPFS) {
    return `.${url}`
  }
  return url
}

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: AppType) => (props: AppPropsType) => (
            <StyleSheetManager sheet={sheet.instance} enableVendorPrefixes={false}>
              <App {...props} />
            </StyleSheetManager>
          ),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html data-theme="light" lang="en">
        <Head>
          {process.env.NODE_ENV === 'production' && (
            <meta httpEquiv="Content-Security-Policy" content={cspWithoutFrameAncestors} />
          )}
          <script dangerouslySetInnerHTML={{ __html: hiddenCheckScript }} />
          <script
            dangerouslySetInnerHTML={{
              __html: themeSwitcherScript,
            }}
          />
          {process.env.NEXT_PUBLIC_IPFS && (
            <>
              {/* eslint-disable-next-line react/no-danger */}
              <script dangerouslySetInnerHTML={{ __html: ipfsPathScript }} />
              {/* eslint-disable-next-line @next/next/no-css-tags */}
              <link rel="stylesheet" href="./fonts/fonts.css" />
            </>
          )}

          {/* ===== ESSENTIAL META TAGS ===== */}
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="referrer" content="origin-when-cross-origin" />

          {/* ===== PRIMARY META TAGS ===== */}
          <meta name="title" content="ECNS - Ethereum Classic Name Service | Claim Your .etc Domain" />
          <meta name="description" content="ECNS is the decentralized naming system for Ethereum Classic. Register human-readable .etc domains for your wallet addresses. Built on ETC mainnet and Mordor testnet." />
          <meta name="keywords" content="ECNS, Ethereum Classic, ETC, .etc domain, blockchain domain, web3, decentralized naming, crypto domain, ENS fork, ETC names, wallet address, NFT domain, blockchain identity, Mordor testnet" />
          <meta name="author" content="ECNS Domains" />
          <meta name="creator" content="ECNS Domains" />
          <meta name="publisher" content="ECNS Domains" />

          {/* ===== CRAWLERS & INDEXING ===== */}
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="bingbot" content="index, follow" />
          <meta name="revisit-after" content="7 days" />
          <meta name="rating" content="general" />
          <meta name="distribution" content="global" />

          {/* ===== OPEN GRAPH / FACEBOOK ===== */}
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:site_name" content="ECNS - Ethereum Classic Name Service" />
          <meta property="og:title" content="ECNS - Claim Your .etc Domain" />
          <meta property="og:description" content="Decentralized naming for Ethereum Classic. Register human-readable .etc domains for your wallet addresses. Secure, censorship-resistant blockchain identity." />
          <meta property="og:url" content="https://ecns.domains" />
          <meta property="og:image" content="https://ecns.domains/og-image.png" />
          <meta property="og:image:secure_url" content="https://ecns.domains/og-image.png" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="ECNS - Ethereum Classic Name Service resolver diamond mark" />

          {/* ===== TWITTER CARD ===== */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@ecnsdomains" />
          <meta name="twitter:creator" content="@ecnsdomains" />
          <meta name="twitter:title" content="ECNS - Claim Your .etc Domain" />
          <meta name="twitter:description" content="Decentralized naming for Ethereum Classic. Register human-readable .etc domains for your wallet addresses." />
          <meta name="twitter:image" content="https://ecns.domains/og-image.png" />
          <meta name="twitter:image:alt" content="ECNS - Ethereum Classic Name Service" />
          <meta name="twitter:domain" content="ecns.domains" />

          {/* ===== THEME & MOBILE ===== */}
          <meta name="theme-color" content="#3FB68B" />
          <meta name="theme-color" media="(prefers-color-scheme: light)" content="#3FB68B" />
          <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1A3A2E" />
          <meta name="msapplication-TileColor" content="#3FB68B" />
          <meta name="msapplication-TileImage" content="/android-chrome-144x144.png" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="application-name" content="ECNS" />
          <meta name="apple-mobile-web-app-title" content="ECNS" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="mobile-web-app-capable" content="yes" />

          {/* ===== STRUCTURED DATA (JSON-LD) ===== */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                name: 'ECNS - Ethereum Classic Name Service',
                alternateName: 'ECNS',
                url: 'https://ecns.domains',
                description: 'Decentralized naming system for Ethereum Classic. Register human-readable .etc domains for your wallet addresses.',
                applicationCategory: 'BlockchainApplication',
                operatingSystem: 'Web Browser',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'ETC',
                  description: 'Register .etc domains on Ethereum Classic',
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'ECNS Domains',
                  url: 'https://ecns.domains',
                  logo: 'https://ecns.domains/favicon.svg',
                  sameAs: [
                    'https://x.com/ecnsdomains',
                    'https://github.com/ecnsdomains',
                  ],
                },
                image: 'https://ecns.domains/og-image.png',
                screenshot: 'https://ecns.domains/og-image.png',
                featureList: [
                  'Register .etc domains',
                  'Decentralized naming',
                  'Wallet address mapping',
                  'ENS-compatible',
                  'Multi-chain support',
                ],
                keywords: 'ECNS, Ethereum Classic, ETC, .etc domain, blockchain domain, web3, decentralized naming',
              }),
            }}
          />

          {/* ===== FAVICONS & ICONS ===== */}
          <link rel="manifest" href={makeIPFSURL('/manifest.webmanifest')} />
          <link rel="manifest" href={makeIPFSURL('/manifest.json')} />
          <link rel="apple-touch-icon" sizes="180x180" href={makeIPFSURL('/apple-touch-icon.png')} />
          <link rel="icon" href={makeIPFSURL('/favicon.svg')} type="image/svg+xml" />
          <link rel="icon" type="image/png" sizes="32x32" href={makeIPFSURL('/favicon-32x32.png')} />
          <link rel="icon" type="image/png" sizes="16x16" href={makeIPFSURL('/favicon-16x16.png')} />
          <link rel="mask-icon" href={makeIPFSURL('/mask-icon.svg')} color="#3FB68B" />
          <link rel="shortcut icon" href={makeIPFSURL('/favicon.ico')} />

          {/* ===== PRECONNECT & FONTS ===== */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap"
            rel="stylesheet"
          />

          {/* ===== CANONICAL & DNS PREFETCH ===== */}
          <link rel="canonical" href="https://ecns.domains" />
          <link rel="dns-prefetch" href="https://rpc.mordor.etccooperative.org" />
          <link rel="dns-prefetch" href="https://etc.rivet.cloud" />

          {/* ===== ANALYTICS ===== */}
          <script
            defer
            data-domain="ecns.domains"
            src="https://plausible.io/js/script.outbound-links.js"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
