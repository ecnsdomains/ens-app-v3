import { SERVICES } from '@app/constants/brand'

export const emptyAddress = '0x0000000000000000000000000000000000000000'

export const GRACE_PERIOD = 90 * 24 * 60 * 60 * 1000

export const MOONPAY_WORKER_URL: { [key: number]: string } = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  1: SERVICES.moonpayWorkerUrl,
}

export const FAUCET_WORKER_URL = SERVICES.faucetWorkerUrl

export const WC_PROJECT_ID = '9b14144d470af1e03ab9d88aaa127332'

// 102% of price as buffer for fluctuations
export const CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE = 102n

// ECNS static OG image (until dynamic OG worker is deployed)
export const OG_IMAGE_URL = 'https://ecns.domains'

export const IS_DEV_ENVIRONMENT =
  process.env.NEXT_PUBLIC_ENSJS_DEBUG ||
  process.env.NODE_ENV === 'development' ||
  process.env.NEXT_PUBLIC_PROVIDER

export const INVALID_NAME = '[Invalid ECNS Name]'

export const ECNS_LINKS = {
  X: 'https://x.com/ecnsdomains',
  DISCORD: 'https://discord.gg/ecns',
  GITHUB: 'https://github.com/ecnsdomains',
  EMAIL: 'mailto:support@ecns.domains',
  HOMEPAGE: 'https://ecns.domains/',
}


export const DISCONNECTED_PLACEHOLDER_ADDRESS =
  '0x0000000000000000000000000000000000001234' as const
