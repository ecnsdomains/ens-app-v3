import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'
import { useAccount } from 'wagmi'

import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import UnwrapButton from './UnwrapButton'
import { testDomain } from '@root/test/chainConstants'

vi.mock('wagmi')

vi.mock('@app/transaction-flow/TransactionFlowProvider')

const mockUseAccount = mockFunction(useAccount)

const mockUseTransaction = mockFunction(useTransactionFlow)

const mockCreateTransactionFlow = vi.fn()

describe('UnwrapButton', () => {
  mockUseTransaction.mockReturnValue({
    createTransactionFlow: mockCreateTransactionFlow,
  })
  it('should render', () => {
    mockUseAccount.mockReturnValue({ address: '0x123' })
    render(
      <UnwrapButton name={testDomain('test123')} ownerData={{ owner: '0x123' } as any} status="wrapped" />,
    )
    expect(screen.getByTestId('unwrap-name-btn')).toBeVisible()
  })
  it('should render null if disconnected', () => {
    mockUseAccount.mockReturnValue({ address: undefined })
    render(
      <UnwrapButton name={testDomain('test123')} ownerData={{ owner: '0x123' } as any} status="wrapped" />,
    )
    expect(screen.queryByTestId('unwrap-name-btn')).toBeNull()
  })
  it('should render null if not owner', () => {
    mockUseAccount.mockReturnValue({ address: '0x123' })
    render(
      <UnwrapButton name={testDomain('test123')} ownerData={{ owner: '0x456' } as any} status="wrapped" />,
    )
    expect(screen.queryByTestId('unwrap-name-btn')).toBeNull()
  })
  it('should render null if locked', () => {
    mockUseAccount.mockReturnValue({ address: '0x123' })
    render(
      <UnwrapButton name={testDomain('test123')} ownerData={{ owner: '0x123' } as any} status="locked" />,
    )
    expect(screen.queryByTestId('unwrap-name-btn')).toBeNull()
  })
  it('should make transaction on click', () => {
    mockUseAccount.mockReturnValue({ address: '0x123' })
    render(
      <UnwrapButton name={testDomain('test123')} ownerData={{ owner: '0x123' } as any} status="wrapped" />,
    )
    screen.getByTestId('unwrap-name-btn').click()
    expect(mockCreateTransactionFlow).toHaveBeenCalledWith(testDomain('unwrapName-test123'), {
      transactions: [{ name: 'unwrapName', data: { name: testDomain('test123') } }],
    })
  })
})
