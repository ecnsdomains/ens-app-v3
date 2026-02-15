import { match } from 'ts-pattern'
import { Address } from 'viem'

import { BRAND } from '@app/constants/brand'
import { getNetworkFromUrl } from '@app/constants/chains'

export const getL2PrimarySiteUrl = (nameOrAddress: string | Address) => {
  const appDomain = new URL(BRAND.appUrl).host
  return match(getNetworkFromUrl())
    .with('sepolia', () => `https://sepolia.primary.${appDomain}/${nameOrAddress}`)
    .otherwise(() => `https://primary.${appDomain}/${nameOrAddress}`)
}
