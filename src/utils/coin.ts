import { getAddress } from 'viem'

import { isNativeCoin } from '@app/constants/tld'

/** @deprecated Use isNativeCoin from @app/constants/tld instead */
export const isEthCoin = isNativeCoin

export const normalizeCoinAddress = ({
  coin,
  address,
}: {
  coin: string | number
  address?: string | null
}): string => {
  if (!address) return ''
  if (isEthCoin(coin)) {
    try {
      return getAddress(address)
    } catch {
      return address
    }
  }
  return address
}
