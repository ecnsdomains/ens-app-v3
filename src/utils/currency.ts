import { formatUnits } from 'viem'

import { isNativeCoin } from '@app/constants/tld'

export const makeDisplay = ({
  value,
  symbol,
  fromDecimals = 18,
}: {
  value: bigint | number
  symbol: string
  fromDecimals?: number
}) => {
  const number = typeof value === 'number' ? value : Number(formatUnits(value, fromDecimals))
  const options: Intl.NumberFormatOptions & { [x: string]: string } = {
    style: 'currency',
    currency: symbol.toLowerCase(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Intl.NumberFormatOptions types don't include 'auto' for useGrouping despite browser support
    useGrouping: 'auto' as any,
    trailingZeroDisplay: 'auto',
  }
  let customSymbol = ''
  if (symbol.toLowerCase() === 'gwei') {
    options.maximumSignificantDigits = 3
    options.maximumFractionDigits = 2
    options.style = 'decimal'
    options.roundingPriority = 'lessPrecision'
    options.currency = undefined
    customSymbol = ` ${symbol}`
  } else if (isNativeCoin(symbol)) {
    if (number < 0.00001) {
      options.maximumSignificantDigits = 1
    }
    options.minimumFractionDigits = 4
    options.maximumFractionDigits = 4
    options.currencyDisplay = 'name'
  } else {
    options.maximumFractionDigits = 2
    options.minimumFractionDigits = 2
    options.currencyDisplay = symbol === 'usd' ? 'narrowSymbol' : 'symbol'
  }
  return new Intl.NumberFormat(undefined, options).format(number) + customSymbol
}
