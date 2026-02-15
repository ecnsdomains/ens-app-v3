import { Skeleton } from '@ensdomains/thorin'

import { getNativeCoinKey, isNativeCoin } from '@app/constants/tld'
import { useNativeCoinPrice } from '@app/hooks/useNativeCoinPrice'
import { CurrencyDisplay } from '@app/types'
import { makeDisplay } from '@app/utils/currency'

type Props = {
  eth?: bigint
  /* Percentage buffer to multiply value by when displaying in ETH, defaults to 100 */
  bufferPercentage?: bigint
  currency: CurrencyDisplay
}

const nativeCoinKey = getNativeCoinKey()

export const makeCurrencyDisplay = ({
  eth,
  nativeCoinPrice,
  bufferPercentage = 100n,
  currency = 'eth',
}: Props & { nativeCoinPrice?: bigint }) => {
  if (!eth || !nativeCoinPrice) return `0.0000 ${nativeCoinKey.toUpperCase()}`
  if (isNativeCoin(currency))
    return makeDisplay({ value: (eth * bufferPercentage) / 100n, symbol: nativeCoinKey })
  return makeDisplay({ value: (eth * nativeCoinPrice) / BigInt(1e8), symbol: currency })
}

export const CurrencyText = ({ eth, bufferPercentage = 100n, currency = 'eth' }: Props) => {
  const { data: nativeCoinPrice, isLoading: isNativeCoinPriceLoading } = useNativeCoinPrice()

  const isLoading = isNativeCoinPriceLoading || !eth || !nativeCoinPrice

  return (
    <Skeleton loading={isLoading}>
      {(() => {
        if (isLoading) return `0.0000 ${nativeCoinKey.toUpperCase()}`
        return makeCurrencyDisplay({ eth, nativeCoinPrice, bufferPercentage, currency })
      })()}
    </Skeleton>
  )
}
