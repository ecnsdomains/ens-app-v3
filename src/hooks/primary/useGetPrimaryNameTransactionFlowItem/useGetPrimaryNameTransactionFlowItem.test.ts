import { mockFunction, renderHook } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import { useReverseRegistryName } from '@app/hooks/nameservice/public/useReverseRegistryName'

import { useGetPrimaryNameTransactionFlowItem } from '.'
import { testDomain } from '@root/test/chainConstants'

vi.mock('@app/hooks/nameservice/public/useReverseRegistryName')
vi.mock('@app/hooks/chain/useContractAddress')

const mockUseReverseRegistryName = mockFunction(useReverseRegistryName)
const mockUseContractAddress = mockFunction(useContractAddress)

const createResolverStatusData = (
  overwrites: { isAuthorized?: boolean; hasMigratedRecord?: boolean; isMigratedProfileEqual?: boolean } = {},
) =>
  ({
    isAuthorized: true,
    hasMigratedRecord: true,
    isMigratedProfileEqual: overwrites.isMigratedProfileEqual ?? overwrites.hasMigratedRecord ?? true,
    ...overwrites,
  }) as unknown as ReturnType<typeof useResolverStatus>['data']

describe('useGetPrimaryNameTransactionFlowItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseReverseRegistryName.mockReturnValue({
      data: testDomain('test'),
      isLoading: false,
      isFetching: false,
    })
    // @ts-ignore
    mockUseContractAddress.mockReturnValue('0xresolver')
  })
  it('should return undefined if there are no transactions to be made', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        profileAddress: '0x123',
        resolverAddress: '0xresolver',
        resolverStatus: createResolverStatusData(),
      }),
    )
    expect(result.current.callBack?.(testDomain('test'))).toBeNull()
  })

  it('should return transaction SetPrimaryName if the reverseRegistryName is undefined.', async () => {
    mockUseReverseRegistryName.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
    })
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        profileAddress: '0x123',
        resolverAddress: '0xresolver',
        resolverStatus: createResolverStatusData(),
      }),
    )
    expect(result.current.callBack?.(testDomain('test'))).toMatchObject({
      transactions: [
        {
          data: {
            name: testDomain('test'),
            address: '0x123',
          },
          name: 'setPrimaryName',
        },
      ],
    })
  })

  it('should return transaction SetPrimaryName if the reverseRegistryName does not match the name.', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        profileAddress: '0x123',
        resolverAddress: '0xresolver',
        resolverStatus: createResolverStatusData(),
      }),
    )
    expect(result.current.callBack?.(testDomain('primary'))).toMatchObject({
      transactions: [
        {
          data: {
            name: testDomain('primary'),
            address: '0x123',
          },
          name: 'setPrimaryName',
        },
      ],
    })
  })

  it('should return transaction updateResolver if the resolver status is unauthorized', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        resolverAddress: '0xresolver',
        resolverStatus: createResolverStatusData({ isAuthorized: false }),
      }),
    )
    expect(result.current.callBack?.(testDomain('test'))).toMatchObject({
      transactions: [
        {
          data: {
            name: testDomain('test'),
            contract: 'registry',
          },
          name: 'updateResolver',
        },
      ],
    })
  })

  it('should return transaction updateResolver using namewrapper contract if the resolver status is unauthorized and name is wrapped', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: true,
        resolverAddress: '0xresolver',
        resolverStatus: createResolverStatusData({ isAuthorized: false }),
      }),
    )
    expect(result.current.callBack?.(testDomain('test'))).toMatchObject({
      transactions: [
        {
          data: {
            name: testDomain('test'),
            contract: 'nameWrapper',
          },
          name: 'updateResolver',
        },
      ],
    })
  })

  it('should return transaction updateResolver and updateNativeCoinAddress on latest resolver if the resolver status is unauthorized and latest resolver does not have eth record migrated', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        resolverAddress: '0xresolver',
        resolverStatus: createResolverStatusData({ isAuthorized: false, hasMigratedRecord: false }),
      }),
    )
    expect(result.current.callBack?.(testDomain('test'))).toMatchObject({
      transactions: [
        {
          data: {
            name: testDomain('test'),
            address: '0x123',
            latestResolver: true,
          },
          name: 'updateNativeCoinAddress',
        },
        {
          data: {
            name: testDomain('test'),
            contract: 'registry',
          },
          name: 'updateResolver',
        },
      ],
    })
  })

  it('should return transaction updateNativeCoinAddress if the profile address is not the same as the use address', () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        profileAddress: '0x1234',
        resolverAddress: '0xresolver',
        resolverStatus: createResolverStatusData(),
      }),
    )
    expect(result.current.callBack?.(testDomain('test'))).toMatchObject({
      transactions: [
        {
          data: {
            name: testDomain('test'),
            address: '0x123',
          },
          name: 'updateNativeCoinAddress',
        },
      ],
    })
  })

  it('should return intro noResolver.title if updating resolver with when profile resolver is empty string', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        resolverAddress: '',
        resolverStatus: createResolverStatusData({ isAuthorized: false, hasMigratedRecord: false }),
      }),
    )
    expect(result.current.callBack?.(testDomain('test'))).toMatchObject({
      intro: {
        title: ['intro.selectPrimaryName.noResolver.title', { ns: 'transactionFlow' }],
      },
    })
  })

  it('should return intro invalidResolver.title if updating resolver with when profile resolver is empty string', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        resolverAddress: '0xresolver',
        resolverStatus: createResolverStatusData({ isAuthorized: false, hasMigratedRecord: false }),
      }),
    )
    expect(result.current.callBack?.(testDomain('test'))).toMatchObject({
      intro: {
        title: ['intro.selectPrimaryName.invalidResolver.title', { ns: 'transactionFlow' }],
      },
    })
  })

  it('should return intro updateNativeCoinAddress.title if setting multi transaction and resolver is authorized', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x1234',
        isWrapped: false,
        resolverAddress: '0xresolver',
        resolverStatus: createResolverStatusData(),
      }),
    )
    expect(result.current.callBack?.(testDomain('primary'))).toMatchObject({
      intro: {
        title: ['intro.selectPrimaryName.updateNativeCoinAddress.title', { ns: 'transactionFlow' }],
      },
    })
  })

  it('should not return intro if setting a single transaction', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        profileAddress: '0x123',
        resolverAddress: '0xresolver',
        resolverStatus: createResolverStatusData(),
      }),
    )
    expect(result.current.callBack?.(testDomain('primary'))?.transactions.length).toBe(1)
    expect(result.current.callBack?.(testDomain('primary'))?.intro).toBeUndefined()
  })

  it('should return 3 transaction steps if profile address does not match user address and resolver is not authorized', () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        profileAddress: '0x1234',
        resolverAddress: '0xresolver',
        resolverStatus: createResolverStatusData({ isAuthorized: false, hasMigratedRecord: false }),
      }),
    )
    expect(result.current.callBack?.(testDomain('primary'))?.transactions.length).toBe(3)
  })
})
