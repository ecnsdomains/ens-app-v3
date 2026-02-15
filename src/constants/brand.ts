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
 * These need deployment per-brand. When a service is not yet deployed,
 * the corresponding feature flag should be false to hide the UI.
 */
export const SERVICES = {
  // TODO: Deploy ECNS metadata service — currently points to ENS
  metadataUrl: 'https://metadata.ens.domains',
  // TODO: Deploy ECNS avatar upload worker
  avatarUploadUrl: 'https://avatar-upload.ens-cf.workers.dev',
  // TODO: Deploy ECNS NFT worker
  nftWorkerUrl: 'https://ens-nft-worker.ens-cf.workers.dev',
  // TODO: Deploy ECNS analytics proxy
  analyticsApiUrl: 'https://jakob.ens.domains',
  // TODO: Deploy ECNS auth worker for Dentity verification
  authWorkerStagingUrl: 'https://auth-worker-staging.ens-cf.workers.dev/v1',
  authWorkerUrl: 'https://auth-worker.ens-cf.workers.dev/v1',
  // TODO: Deploy ECNS MoonPay worker
  moonpayWorkerUrl: 'https://moonpay-worker.ens-cf.workers.dev',
  // TODO: Deploy ECNS faucet worker
  faucetWorkerUrl: 'https://ens-faucet.ens-cf.workers.dev',
  // TODO: Deploy ECNS DotBox premium marketplace worker
  dotboxWorkerUrl: 'https://dotbox-worker.ens-cf.workers.dev',
} as const

/**
 * Feature flags for services not yet deployed.
 * Set to true when the corresponding backend service is ready.
 */
export const FEATURES = {
  /** MoonPay fiat on-ramp integration */
  hasFiatOnramp: false,
  /** DotBox premium name marketplace */
  hasPremiumMarketplace: true,
  /** Dentity identity verification */
  hasVerification: true,
  /** ENS/ECNS faucet for testnet */
  hasFaucet: false,
} as const
