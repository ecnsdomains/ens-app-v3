import { mockFunction, renderHook } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'
import { useConnection } from 'wagmi'

import { useResetSelectedKey } from './TransactionDialogManager'

vi.mock('wagmi')

const mockUseAccount = mockFunction(useConnection)

describe('useResetSelectedKey', () => {
  it('should stopFlow if account changes', async () => {
    const dispatch = vi.fn()
    mockUseAccount.mockReturnValue({ address: '0xAddress' })
    const { rerender } = renderHook(() => useResetSelectedKey(dispatch))
    mockUseAccount.mockReturnValue({ address: '0xOtherAddress' })
    rerender()
    expect(dispatch).toHaveBeenCalledWith({
      name: 'stopFlow',
    })
  })

  it('should not call stopFlow if account stays the same', () => {
    const dispatch = vi.fn()
    mockUseAccount.mockReturnValue({ address: '0xAddress' })
    const { rerender } = renderHook(() => useResetSelectedKey(dispatch))
    mockUseAccount.mockReturnValue({ address: '0xAddress' })
    rerender()
    expect(dispatch).not.toHaveBeenCalled()
  })
})
