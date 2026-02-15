import { Skeleton } from '@ensdomains/thorin'

import { isNativeCoin } from '@app/constants/tld'
import { useNativeCoinPrice } from '@app/hooks/useNativeCoinPrice'
import { CurrencyDisplay } from '@app/types'
import { makeDisplay } from '@app/utils/currency'

type Props = {
  eth?: bigint
  /* Percentage buffer to multiply value by when displaying in ETH, defaults to 100 */
  bufferPercentage?: bigint
  currency: CurrencyDisplay
}

export const makeCurrencyDisplay = ({
  eth,
  nativeCoinPrice,
  bufferPercentage = 100n,
  currency = 'eth',
}: Props & { nativeCoinPrice?: bigint }) => {
  if (!eth || !nativeCoinPrice) return '0.0000 ETH'
  if (isNativeCoin(currency))
    return makeDisplay({ value: (eth * bufferPercentage) / 100n, symbol: 'eth' })
  return makeDisplay({ value: (eth * nativeCoinPrice) / BigInt(1e8), symbol: currency })
}

export const CurrencyText = ({ eth, bufferPercentage = 100n, currency = 'eth' }: Props) => {
  const { data: nativeCoinPrice, isLoading: isNativeCoinPriceLoading } = useNativeCoinPrice()

  const isLoading = isNativeCoinPriceLoading || !eth || !nativeCoinPrice

  return (
    <Skeleton loading={isLoading}>
      {(() => {
        if (isLoading) return '0.0000 ETH'
        return makeCurrencyDisplay({ eth, nativeCoinPrice, bufferPercentage, currency })
      })()}
    </Skeleton>
  )
}
