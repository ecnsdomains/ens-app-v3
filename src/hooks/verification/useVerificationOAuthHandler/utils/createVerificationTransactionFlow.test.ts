import { afterEach, describe, expect, it, vi } from 'vitest'

import { createVerificationTransactionFlow } from './createVerificationTransactionFlow'
import { testDomain } from '@root/test/chainConstants'

const mockCreateTransaction = vi.fn()
const mockRouter = { push: vi.fn() }

const defaultProps = {
  name: testDomain('name'),
  verifier: 'dentity' as const,
  verifiedPresentationUri: 'https://verifiedPresentationUri',
  resolverAddress: '0xresolver',
  createTransactionFlow: mockCreateTransaction,
} as const

const makePropsWithoutProp = (key: keyof typeof defaultProps): any => {
  return Object.fromEntries(Object.entries(defaultProps).filter(([k]) => k !== key))
}

describe('createVerificationTransactionFlow', () => {
  afterEach(() => {
    mockCreateTransaction.mockReset()
    mockRouter.push.mockReset()
  })

  it('should return a transaction item', () => {
    createVerificationTransactionFlow(defaultProps)
    expect(mockCreateTransaction).toBeCalledWith(testDomain('update-verification-record-name'), {
      transactions: [
        {
          data: {
            name: testDomain('name'),
            verifier: 'dentity',
            resolverAddress: '0xresolver',
            verifiedPresentationUri: 'https://verifiedPresentationUri',
          },
          name: 'updateVerificationRecord',
        },
      ],
    })
  })

  it.each([
    'verifier',
    'name',
    'createTransactionFlow',
    'resolverAddress',
    'verifiedPresentationUri',
  ] as (keyof typeof defaultProps)[])(
    'should return undefined if a parameter %s is missing',
    (key) => {
      expect(createVerificationTransactionFlow(makePropsWithoutProp(key))).toBeUndefined()
      expect(mockCreateTransaction).not.toBeCalled()
      expect(mockRouter.push).not.toBeCalled()
    },
  )
})
