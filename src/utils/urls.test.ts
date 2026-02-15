import { mainnet, sepolia } from 'viem/chains'
import { describe, expect, it, vi, afterEach } from 'vitest'

import { getL2PrimarySiteUrl } from './urls'
import { testDomain } from '@root/test/chainConstants'

// Mock the getNetworkFromUrl function while keeping getChainsFromUrl intact
vi.mock('@app/constants/chains', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@app/constants/chains')>()),
  getNetworkFromUrl: vi.fn(),
}))

const mockGetNetworkFromUrl = vi.mocked(
  await import('@app/constants/chains').then((m) => m.getNetworkFromUrl),
)

describe('getL2PrimarySiteUrl', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return sepolia primary URL for sepolia chain', () => {
    mockGetNetworkFromUrl.mockReturnValue('sepolia')

    const result = getL2PrimarySiteUrl(testDomain('test'))

    expect(result).toBe('https://sepolia.primary.app.ecns.domains/test.etc')
  })

  it('should return mainnet primary URL for mainnet chain', () => {
    mockGetNetworkFromUrl.mockReturnValue('mainnet')

    const result = getL2PrimarySiteUrl(testDomain('test'))

    expect(result).toBe('https://primary.app.ecns.domains/test.etc')
  })

  it('should return mainnet primary URL for undefined chain', () => {
    mockGetNetworkFromUrl.mockReturnValue(undefined)

    const result = getL2PrimarySiteUrl(testDomain('test'))

    expect(result).toBe('https://primary.app.ecns.domains/test.etc')
  })



  it('should handle empty name/address', () => {
    mockGetNetworkFromUrl.mockReturnValue('mainnet')

    const result = getL2PrimarySiteUrl('')

    expect(result).toBe('https://primary.app.ecns.domains/')
  })
})