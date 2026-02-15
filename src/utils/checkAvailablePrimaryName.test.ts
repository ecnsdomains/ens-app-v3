import { describe, expect, it } from 'vitest'

import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

import { checkAvailablePrimaryName } from './checkAvailablePrimaryName'
import { testDomain } from '@root/test/chainConstants'

describe('checkAvailablePrimaryName', () => {
  it('should return true for offchain names with resolved address of user', () => {
    const address = '0x189fa72c8959aa18bea737d46c10826de4ef81a2'
    const ownerData = undefined as GetOwnerReturnType | undefined
    const profile = { address, isMigrated: undefined }
    const wrappedData = undefined as GetWrapperDataReturnType | undefined

    const result = checkAvailablePrimaryName(testDomain('primary'), {
      isAuthorized: true,
    } as any)({
      name: testDomain('name'),
      relation: {
        owner: ownerData?.owner === address,
        registrant: ownerData?.registrant === address,
        resolvedAddress: profile?.address === address,
        wrappedOwner: wrappedData?.owner === address,
      },
      isMigrated: profile?.isMigrated !== false,
      expiryDate: undefined,
      fuses: null,
    })
    expect(result).toBe(true)
  })
  it('should return false for name where registrant is user, but nothing else', () => {
    const result = checkAvailablePrimaryName(null, {
      // this value would be false but is irrelevant
      isAuthorized: true,
    } as any)({
      name: testDomain('name'),
      relation: {
        owner: false,
        registrant: true,
        resolvedAddress: false,
        wrappedOwner: false,
      },
      isMigrated: true,
      expiryDate: undefined,
      fuses: null,
    })
    expect(result).toBe(false)
  })
})
