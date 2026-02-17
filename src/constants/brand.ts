/**
 * Brand configuration for the name service deployment.
 * Change this file to deploy as a different brand (e.g., BNS on BSC).
 * All brand references in the app should use these values via {{brandName}} interpolation.
 */
export const BRAND = {
  name: 'ECNS',
  fullName: 'Ethereum Classic Name Service',
  supportUrl: 'https://support.ecns.domains',
  appUrl: 'https://app.ecns.domains',
  docsUrl: 'https://docs.ecns.domains',
  discordUrl: 'https://discord.gg/ecns',
  supportEmail: 'support@ecns.domains',
  homepageUrl: 'https://ecns.domains',
  xUrl: 'https://x.com/ecnsdomains',
  githubUrl: 'https://github.com/ecnsdomains',
} as const

/**
 * External service URLs for backend workers and third-party services.
 * Set via NEXT_PUBLIC_* env vars in .env.local when services are deployed.
 * Empty string = service not connected (UI should check before calling).
 */
export const SERVICES = {
  metadataUrl: process.env.NEXT_PUBLIC_METADATA_URL || '',
  avatarUploadUrl: process.env.NEXT_PUBLIC_AVATAR_UPLOAD_URL || '',
  nftWorkerUrl: process.env.NEXT_PUBLIC_NFT_WORKER_URL || '',
  analyticsApiUrl: process.env.NEXT_PUBLIC_ANALYTICS_API_URL || '',
  authWorkerStagingUrl: process.env.NEXT_PUBLIC_AUTH_WORKER_STAGING_URL || '',
  authWorkerUrl: process.env.NEXT_PUBLIC_AUTH_WORKER_URL || '',
  moonpayWorkerUrl: process.env.NEXT_PUBLIC_MOONPAY_WORKER_URL || '',
  faucetWorkerUrl: process.env.NEXT_PUBLIC_FAUCET_WORKER_URL || '',
  dotboxWorkerUrl: process.env.NEXT_PUBLIC_DOTBOX_WORKER_URL || '',
} as const

/**
 * Feature flags for services not yet deployed.
 * Set to true when the corresponding backend service is ready.
 */
export const FEATURES = {
  /** MoonPay fiat on-ramp integration (requires moonpayWorkerUrl) */
  hasFiatOnramp: false,
  /** DotBox premium name marketplace (requires dotboxWorkerUrl) */
  hasPremiumMarketplace: false,
  /** Dentity identity verification (requires authWorkerUrl) */
  hasVerification: false,
  /** ECNS faucet for testnet (requires faucetWorkerUrl) */
  hasFaucet: false,
} as const
