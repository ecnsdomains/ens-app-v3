import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { useNativeCoinPrice } from '@app/hooks/useNativeCoinPrice'

import { CurrencyText } from './CurrencyText'
import { COIN_KEY, COIN_SYMBOL } from '@root/test/chainConstants'

vi.mock('@app/hooks/useNativeCoinPrice')

const mockUseNativeCoinPrice = mockFunction(useNativeCoinPrice)
mockUseNativeCoinPrice.mockReturnValue({ data: BigInt(1e8), isLoading: false })

describe('CurrencyText', () => {
  it('should render correctly', async () => {
    render(<CurrencyText eth={4000000000000000000n} currency={COIN_KEY as any} />)
    expect(screen.getByText(`4.0000 ${COIN_SYMBOL}`)).toBeVisible()
  })

  it('should append extra decimal to usd if it does not exist', async () => {
    render(<CurrencyText eth={4000000000000000000n} currency="usd" />)
    expect(screen.getByText('$4.00')).toBeVisible()
  })

  it(`should cut off at ${COIN_SYMBOL} at 4 decimals`, async () => {
    render(<CurrencyText eth={4444444444444444444n} currency={COIN_KEY as any} />)
    expect(screen.getByText(`4.4444 ${COIN_SYMBOL}`)).toBeVisible()
  })
})
