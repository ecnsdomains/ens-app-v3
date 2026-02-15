import { mockFunction, renderHook } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getRegistrationStatus } from '@app/utils/registrationStatus'
import { createDateAndValue } from '@app/utils/utils'

import { makeMockUseAddrRecordData } from '../../test/mock/makeMockUseAddrRecordData'
import {
  makeMockUseBasicName,
  mockUseBasicNameConfig,
  mockUseBasicNameTypes,
} from '../../test/mock/makeMockUseBasicName'
import { makeMockUseContractAddress } from '../../test/mock/makeMockUseContractAddress'
import { makeMockUseExpiryData } from '../../test/mock/makeMockUseExpiryData'
import { makeMockUseOwnerData } from '../../test/mock/makeMockUseOwnerData'
import { makeMockUsePriceData } from '../../test/mock/makeMockUsePriceData'
import { makeMockUseSubgraphRegistrantData } from '../../test/mock/makeMockUseSubgraphRegistrantData'
import { makeMockUseValidate } from '../../test/mock/makeMockUseValidate'
import { makeMockUseWrapperDataData } from '../../test/mock/makeMockUseWrapperDataData.ts'
import { useContractAddress } from './chain/useContractAddress'
import useCurrentBlockTimestamp from './chain/useCurrentBlockTimestamp'
import { useAddressRecord } from './nameservice/public/useAddressRecord'
import { useExpiry } from './nameservice/public/useExpiry'
import { useOwner } from './nameservice/public/useOwner'
import { usePrice } from './nameservice/public/usePrice'
import { useWrapperData } from './nameservice/public/useWrapperData'
import { useSubgraphRegistrant } from './nameservice/subgraph/useSubgraphRegistrant'
import { useBasicName } from './useBasicName'
import { useSupportsTLD } from './useSupportsTLD'
import { useValidate } from './useValidate'
import { testDomain, testSub } from '@root/test/chainConstants'

vi.mock('./chain/useCurrentBlockTimestamp')
vi.mock('./chain/useContractAddress')
vi.mock('./useValidate')
vi.mock('./useSupportsTLD')
vi.mock('@app/utils/registrationStatus')

vi.mock('./nameservice/public/useOwner')
vi.mock('./nameservice/public/useExpiry')
vi.mock('./nameservice/public/useWrapperData')
vi.mock('./nameservice/public/usePrice')
vi.mock('./nameservice/public/useAddressRecord')
vi.mock('./nameservice/subgraph/useSubgraphRegistrant')
vi.setSystemTime(new Date())

const mockUseValidate = mockFunction(useValidate)
const mockUseContractAddress = mockFunction(useContractAddress)
const mockUseSupportsTLD = mockFunction(useSupportsTLD)
const mockUseCurrentBlockTimestamp = mockFunction(useCurrentBlockTimestamp)
const mockGetRegistrationStatus = mockFunction(getRegistrationStatus)

const mockUseOwner = mockFunction(useOwner)
const mockUseExpiry = mockFunction(useExpiry)
const mockUseWrapperData = mockFunction(useWrapperData)
const mockUsePrice = mockFunction(usePrice)
const mockUseAddressRecord = mockFunction(useAddressRecord)
const mockUseSubgraphRegistrant = mockFunction(useSubgraphRegistrant)

describe('useBasicName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSupportsTLD.mockReturnValue({ data: true, isLoading: false })
    mockUseOwner.mockReturnValue({ data: undefined, isLoading: false })
    mockUseExpiry.mockReturnValue({ data: undefined, isLoading: false })
    mockUseWrapperData.mockReturnValue({ data: undefined, isLoading: false })
    mockUsePrice.mockReturnValue({ data: undefined, isLoading: false })
    mockUseAddressRecord.mockReturnValue({ data: undefined, isLoading: false })
    // @ts-ignore
    mockUseContractAddress.mockImplementation((arg) => makeMockUseContractAddress(arg))
    mockUseAddressRecord.mockReturnValue({ data: undefined, isLoading: false })
    mockUseSubgraphRegistrant.mockReturnValue({ data: undefined, isLoading: false })
  })
  describe('2LD .etc', () => {
    beforeEach(() => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isNativeTld: true,
        isShort: false,
        name: testDomain('test'),
        labelCount: 2,
      })
    })
    it('should query for the owner', () => {
      renderHook(() => useBasicName({ name: testDomain('test') }))
      expect(mockUseOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
        }),
      )
    })
    it('should query for the wrapper data', () => {
      renderHook(() => useBasicName({ name: testDomain('test') }))
      expect(mockUseWrapperData).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
        }),
      )
    })
    it('should query for the expiry', () => {
      renderHook(() => useBasicName({ name: testDomain('test') }))
      expect(mockUseExpiry).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
        }),
      )
    })
    it('should query for the price', () => {
      renderHook(() => useBasicName({ name: testDomain('test') }))
      expect(mockUsePrice).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
        }),
      )
    })
  })
  describe('2LD non .etc', () => {
    beforeEach(() => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isNativeTld: false,
        isShort: true,
        name: 'te.pw',
        labelCount: 2,
      })
    })
    it('should query for the owner', () => {
      renderHook(() => useBasicName({ name: testDomain('test') }))
      expect(mockUseOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
        }),
      )
    })
    it('should query for the wrapper data', () => {
      renderHook(() => useBasicName({ name: testDomain('test') }))
      expect(mockUseWrapperData).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
        }),
      )
    })
  })
  describe('DNS', () => {
    beforeEach(() => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isNativeTld: false,
        isShort: false,
        name: 'test.com',
        labelCount: 2,
      })
    })
    it('should query for the owner', () => {
      renderHook(() => useBasicName({ name: 'test.com' }))
      expect(mockUseOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
        }),
      )
    })
    it('should query for the wrapper data', () => {
      renderHook(() => useBasicName({ name: 'test.com' }))
      expect(mockUseWrapperData).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
        }),
      )
    })
    it('should not query for the expiry', () => {
      renderHook(() => useBasicName({ name: 'test.com' }))
      expect(mockUseExpiry).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      )
    })
    it('should not query for the price', () => {
      renderHook(() => useBasicName({ name: 'test.com' }))
      expect(mockUsePrice).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      )
    })
  })
  describe('[root]', () => {
    beforeEach(() => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        name: '[root]',
        labelCount: 1,
      })
    })
    it('should query for the owner', () => {
      renderHook(() => useBasicName({ name: '[root]' }))
      expect(mockUseOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
        }),
      )
    })
    it('should not query for wrapper data', () => {
      renderHook(() => useBasicName({ name: '[root]' }))
      expect(mockUseWrapperData).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      )
    })
    it('should not query for the expiry', () => {
      renderHook(() => useBasicName({ name: '[root]' }))
      expect(mockUseExpiry).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      )
    })
    it('should not query for the price', () => {
      renderHook(() => useBasicName({ name: '[root]' }))
      expect(mockUsePrice).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      )
    })
  })
  describe('expiry poll', () => {
    const gracePeriodSeconds = 60 * 60 * 24 * 90 // 90 days
    const ms5Minutes = 1_000 * 60 * 5
    it('should enable useCurrentBlockTimestamp when a grace period ends in less than 5 minutes', () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isNativeTld: true,
        isShort: false,
        name: testDomain('test'),
        labelCount: 2,
      })
      mockUseOwner.mockReturnValue({
        data: {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      mockUseExpiry.mockReturnValue({
        data: {
          expiry: createDateAndValue(
            BigInt(Date.now() - gracePeriodSeconds * 1000 + ms5Minutes - 1000),
          ),
          gracePeriod: gracePeriodSeconds,
        },
        isLoading: false,
      })
      mockUsePrice.mockReturnValue({
        data: {
          base: 0n,
          premium: 0n,
        },
        isLoading: false,
      })
      renderHook(() => useBasicName({ name: testDomain('test') }))
      expect(mockUseCurrentBlockTimestamp).toHaveBeenCalledWith({ enabled: true })
    })
    it('should enable useCurrentBlockTimestamp when a grace period ended less than 5 minutes ago', () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isNativeTld: true,
        isShort: false,
        name: testDomain('test'),
        labelCount: 2,
      })
      mockUseOwner.mockReturnValue({
        data: {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      mockUseExpiry.mockReturnValue({
        data: {
          expiry: createDateAndValue(
            BigInt(Date.now() - gracePeriodSeconds * 1000 - ms5Minutes + 1000),
          ),
          gracePeriod: gracePeriodSeconds,
        },
        isLoading: false,
      })
      mockUsePrice.mockReturnValue({
        data: {
          base: 0n,
          premium: 0n,
        },
        isLoading: false,
      })
      renderHook(() => useBasicName({ name: testDomain('test') }))
      expect(mockUseCurrentBlockTimestamp).toHaveBeenCalledWith({ enabled: true })
    })
    it('should not enable useCurrentBlockTimestamp when a grace period ends in more than 5 minutes', () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isNativeTld: true,
        isShort: false,
        name: testDomain('test'),
        labelCount: 2,
      })
      mockUseOwner.mockReturnValue({
        data: {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      mockUseExpiry.mockReturnValue({
        data: {
          expiry: createDateAndValue(BigInt(Date.now() - gracePeriodSeconds + ms5Minutes + 1000)),
          gracePeriod: gracePeriodSeconds,
        },
        isLoading: false,
      })
      mockUsePrice.mockReturnValue({
        data: {
          base: 0n,
          premium: 0n,
        },
        isLoading: false,
      })
      renderHook(() => useBasicName({ name: testDomain('test') }))
      expect(mockUseCurrentBlockTimestamp).toHaveBeenCalledWith({ enabled: false })
    })
    it('should not enable useCurrentBlockTimestamp when a grace period ended more than 5 minutes ago', () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isNativeTld: true,
        isShort: false,
        name: testDomain('test'),
        labelCount: 2,
      })
      mockUseOwner.mockReturnValue({
        data: {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      mockUseExpiry.mockReturnValue({
        data: {
          expiry: createDateAndValue(BigInt(Date.now() - gracePeriodSeconds - ms5Minutes - 1000)),
          gracePeriod: gracePeriodSeconds,
        },
        isLoading: false,
      })
      mockUsePrice.mockReturnValue({
        data: {
          base: 0n,
          premium: 0n,
        },
        isLoading: false,
      })
      renderHook(() => useBasicName({ name: testDomain('test') }))
      expect(mockUseCurrentBlockTimestamp).toHaveBeenCalledWith({ enabled: false })
    })
    it('should not enable useCurrentBlockTimestamp when name does not have a grace period (not 2ld .eth)', () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: false,
        isNativeTld: true,
        isShort: false,
        name: testSub('abc', 'test'),
        labelCount: 3,
      })
      mockUseOwner.mockReturnValue({
        data: {
          owner: '0x123',
          ownershipLevel: 'nameWrapper',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      mockUseExpiry.mockReturnValue({
        data: {
          expiry: createDateAndValue(BigInt(Date.now())),
          gracePeriod: undefined,
        },
        isLoading: false,
      })
      mockUsePrice.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      renderHook(() => useBasicName({ name: testSub('abc', 'test') }))
      expect(mockUseCurrentBlockTimestamp).toHaveBeenCalledWith({ enabled: false })
    })
    it('should pass browser timestamp to getRegistrationStatus when isTempPremiumDesynced is false', () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: false,
        isNativeTld: true,
        isShort: false,
        name: testSub('abc123', 'test'),
        labelCount: 3,
      })
      mockUseOwner.mockReturnValue({
        data: {
          owner: '0x123',
          ownershipLevel: 'nameWrapper',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      mockUseExpiry.mockReturnValue({
        data: {
          expiry: createDateAndValue(BigInt(Date.now())),
          gracePeriod: undefined,
        },
        isLoading: false,
      })
      mockUsePrice.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      vi.spyOn(Date, 'now').mockReturnValue(1234567890)
      renderHook(() => useBasicName({ name: testSub('abc123', 'test') }))
      expect(mockGetRegistrationStatus).toHaveBeenCalledWith(
        expect.objectContaining({ timestamp: 1234567890 }),
      )
    })
    it('should pass block timestamp to getRegistrationStatus when isTempPremiumDesynced is true and data is returned from useCurrentBlockTimestamp', () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isNativeTld: true,
        isShort: false,
        name: testDomain('test'),
        labelCount: 2,
      })
      mockUseOwner.mockReturnValue({
        data: {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      mockUseExpiry.mockReturnValue({
        data: {
          expiry: createDateAndValue(
            BigInt(Date.now() - gracePeriodSeconds * 1000 + ms5Minutes - 1000),
          ),
          gracePeriod: gracePeriodSeconds,
        },
        isLoading: false,
      })
      mockUsePrice.mockReturnValue({
        data: {
          base: 0n,
          premium: 0n,
        },
        isLoading: false,
      })
      mockUseCurrentBlockTimestamp.mockReturnValue(1n)
      renderHook(() => useBasicName({ name: testDomain('test') }))
      expect(mockGetRegistrationStatus).toHaveBeenCalledWith(
        expect.objectContaining({ timestamp: 1000 }),
      )
    })
    it('should pass delayed browser timestamp when isTempPremiumDesynced is true and data is not returned from useCurrentBlockTimestamp', () => {
      mockUseValidate.mockReturnValue({
        isValid: true,
        is2LD: true,
        isNativeTld: true,
        isShort: false,
        name: testDomain('test'),
        labelCount: 2,
      })
      mockUseOwner.mockReturnValue({
        data: {
          registrant: '0x123',
          owner: '0x123',
          ownershipLevel: 'registrar',
        },
        isLoading: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
      mockUseExpiry.mockReturnValue({
        data: {
          expiry: createDateAndValue(
            BigInt(1234567890 - gracePeriodSeconds * 1000 + ms5Minutes - 1000),
          ),
          gracePeriod: gracePeriodSeconds,
        },
        isLoading: false,
      })
      mockUsePrice.mockReturnValue({
        data: {
          base: 0n,
          premium: 0n,
        },
        isLoading: false,
      })
      vi.spyOn(Date, 'now').mockReturnValue(1234567890)
      mockUseCurrentBlockTimestamp.mockReturnValue(undefined)
      renderHook(() => useBasicName({ name: testDomain('test') }))
      expect(mockGetRegistrationStatus).toHaveBeenCalledWith(
        expect.objectContaining({ timestamp: 1234567890 - ms5Minutes }),
      )
    })
  })
  describe('mocks', () => {
    it.each(mockUseBasicNameTypes)('should return expect value for %s', async (type) => {
      const config = mockUseBasicNameConfig[type]
      const {
        useValidateType,
        useOwnerType,
        useWrapperDataType,
        useExpiryType,
        usePriceType,
        useAddrRecordType,
        useSubgraphRegistrantType,
      } = config
      mockUseValidate.mockReturnValue(makeMockUseValidate(useValidateType))
      mockUseSupportsTLD.mockReturnValue({ data: true, isLoading: false })
      mockUseOwner.mockReturnValue({
        data: makeMockUseOwnerData(useOwnerType),
        isLoading: false,
        isCachedData: false,
      })
      mockUseWrapperData.mockReturnValue({
        data: makeMockUseWrapperDataData(useWrapperDataType),
        isLoading: false,
        isCachedData: false,
      })
      mockUseExpiry.mockReturnValue({
        data: makeMockUseExpiryData(useExpiryType),
        isLoading: false,
        isCachedData: false,
      })
      mockUsePrice.mockReturnValue({
        data: makeMockUsePriceData(usePriceType),
        isLoading: false,
        isCachedData: false,
      })
      mockUseAddressRecord.mockReturnValue({
        data: makeMockUseAddrRecordData(useAddrRecordType),
        isLoading: false,
        isCachedData: false,
      })
      mockUseSubgraphRegistrant.mockReturnValue({
        data: makeMockUseSubgraphRegistrantData(useSubgraphRegistrantType),
        isLoading: false,
      })
      const test = await vi.importActual<typeof import('@app/utils/registrationStatus')>(
        '@app/utils/registrationStatus',
      )
      mockGetRegistrationStatus.mockImplementation((args) => test.getRegistrationStatus(args))
      const { result } = renderHook(() => useBasicName({ name: testDomain('name') }))
      const expected = makeMockUseBasicName(type)
      const { refetchIfEnabled, ...resultData } = result.current
      expect(expected).toEqual(resultData)
    })
  })
})
