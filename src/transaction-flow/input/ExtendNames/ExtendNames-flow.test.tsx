import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'
import { useAccount, useBalance } from 'wagmi'

import { useEstimateGasWithStateOverride } from '@app/hooks/chain/useEstimateGasWithStateOverride'
import { useExpiry } from '@app/hooks/nameservice/public/useExpiry'
import { usePrice } from '@app/hooks/nameservice/public/usePrice'
import { useNativeCoinPrice } from '@app/hooks/useNativeCoinPrice'
import { useReferrer } from '@app/hooks/useReferrer'

import { makeMockIntersectionObserver } from '../../../../test/mock/makeMockIntersectionObserver'
import ExtendNames from './ExtendNames-flow'
import { testDomain } from '@root/test/chainConstants'

vi.mock('@app/hooks/chain/useEstimateGasWithStateOverride')
vi.mock('@app/hooks/nameservice/public/usePrice')
vi.mock('wagmi')
vi.mock('@app/hooks/nameservice/public/useExpiry')
vi.mock('@app/hooks/useNativeCoinPrice')
vi.mock('@app/hooks/useReferrer')

const mockUseEstimateGasWithStateOverride = mockFunction(useEstimateGasWithStateOverride)
const mockUsePrice = mockFunction(usePrice)
const mockUseAccount = mockFunction(useAccount)
const mockUseBalance = mockFunction(useBalance)
const mockUseNativeCoinPrice = mockFunction(useNativeCoinPrice)
const mockUseExpiry = mockFunction(useExpiry)
const mockUseReferrer = mockFunction(useReferrer)

vi.mock('@ensdomains/thorin', async () => {
  const originalModule = await vi.importActual('@ensdomains/thorin')
  return {
    ...originalModule,
    ScrollBox: vi.fn(({ children }) => children),
  }
})
vi.mock('@app/components/@atoms/Invoice/Invoice', async () => {
  const originalModule = await vi.importActual('@app/components/@atoms/Invoice/Invoice')
  return {
    ...originalModule,
    Invoice: vi.fn(() => <div>Invoice</div>),
  }
})

makeMockIntersectionObserver()

describe('Extendnames', () => {
  mockUseEstimateGasWithStateOverride.mockReturnValue({
    data: { gasEstimate: 21000n, gasCost: 100n },
    gasPrice: 100n,
    error: null,
    isLoading: false,
  })
  mockUsePrice.mockReturnValue({
    data: {
      base: 100n,
      premium: 0n,
    },
    isLoading: false,
  })
  mockUseAccount.mockReturnValue({ address: '0x1234', isConnected: true })
  mockUseBalance.mockReturnValue({ data: { balance: 100n }, isLoading: false })
  mockUseNativeCoinPrice.mockReturnValue({ data: 100n, isLoading: false })
  mockUseExpiry.mockReturnValue({ data: { expiry: { date: new Date() } }, isLoading: false })
  mockUseReferrer.mockReturnValue(undefined)
  it('should render', async () => {
    render(
      <ExtendNames
        {...{
          data: { names: [testDomain('nick')], hasWrapped: false },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
  })
  it('should have Invoice greyed out if gas limit estimation is still loading', () => {
    mockUseEstimateGasWithStateOverride.mockReturnValueOnce({
      data: { gasEstimate: 21000n, gasCost: 100n },
      gasPrice: 100n,
      error: null,
      isLoading: true,
    })
    render(
      <ExtendNames
        {...{
          data: { names: [testDomain('nick')], isSelf: true, hasWrapped: false },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
    const optionBar = screen.getByText('Invoice')
    const { parentElement } = optionBar
    expect(parentElement).toHaveStyle('opacity: 0.5')
  })
  it('should disabled next button if the price data is loading ', () => {
    mockUsePrice.mockReturnValueOnce({
      isLoading: true,
    })
    render(
      <ExtendNames
        {...{
          data: { names: [testDomain('nick')], isSelf: true, hasWrapped: false },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
    const trailingButton = screen.getByTestId('extend-names-confirm')
    expect(trailingButton).toHaveAttribute('disabled')
  })
})
