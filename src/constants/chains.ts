import { match } from 'ts-pattern'
import { localhost, mainnet, sepolia } from 'viem/chains'

import type { Register } from '@app/local-contracts'
import { addEnsContractsWithSubgraphAndOverrides } from '@app/overrides/addEnsContractsWithSubgraphAndOverrides'
import { makeLocalhostChainWithEnsAndOverrides } from '@app/overrides/makeLocalhostChainWithEnsAndOverrides'
import {
  ecnsChains,
  etcMainnet,
  etcMainnetWithEcns,
  mordor,
  mordorWithEcns,
} from '@app/utils/chains/makeMordorChainWithEcns'

export const deploymentAddresses = JSON.parse(
  process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}',
) as Register['deploymentAddresses']

export const localhostWithEns = makeLocalhostChainWithEnsAndOverrides<typeof localhost>(
  localhost,
  deploymentAddresses,
)

const ENS_SUBGRAPH_API_KEY = process.env.NEXT_PUBLIC_ENS_SUBGRAPH_API_KEY || ''

export const mainnetWithEns = addEnsContractsWithSubgraphAndOverrides({
  chain: mainnet,
  subgraphId: '5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH',
  apiKey: ENS_SUBGRAPH_API_KEY,
})

export const sepoliaWithEns = addEnsContractsWithSubgraphAndOverrides({
  chain: sepolia,
  subgraphId: 'G1SxZs317YUb9nQX3CC98hDyvxfMJNZH5pPRGpNrtvwN',
  apiKey: ENS_SUBGRAPH_API_KEY,
})

// ECNS chains (ETC ecosystem)
export { etcMainnet, etcMainnetWithEcns, mordor, mordorWithEcns }

// All supported chains
export const chainsWithEns = [
  mainnetWithEns,
  sepoliaWithEns,
  localhostWithEns,
  mordorWithEcns,
  etcMainnetWithEcns,
] as const

export const getSupportedChainById = (chainId: number | undefined) =>
  chainId ? chainsWithEns.find((c) => c.id === chainId) : undefined

export type SupportedChain =
  | typeof mainnetWithEns
  | typeof sepoliaWithEns
  | typeof localhostWithEns
  | typeof mordorWithEcns
  | typeof etcMainnetWithEcns

// Detect if we're in ECNS mode (ETC chains only)
const isEcnsMode = (): boolean => {
  if (typeof window === 'undefined') return true // SSR default to ECNS
  const chain = process.env.NEXT_PUBLIC_CHAIN_NAME
  if (chain === 'ecns' || chain === 'mordor' || chain === 'etc') return true
  // Check hostname for ecns.domains
  const { hostname } = window.location
  if (hostname.includes('ecns')) return true
  // Default to ECNS for localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') return true
  return false
}

export const getNetworkFromUrl = ():
  | 'mainnet'
  | 'sepolia'
  | 'localhost'
  | 'mordor'
  | 'etc'
  | 'ecns'
  | undefined => {
  if (typeof window === 'undefined') return undefined

  const { hostname } = window.location
  const segments = hostname.split('.')

  // Chain override
  const chain = process.env.NEXT_PUBLIC_CHAIN_NAME
  if (chain === 'sepolia') return 'sepolia' as const
  if (chain === 'mainnet') return 'mainnet' as const
  if (chain === 'mordor') return 'mordor' as const
  if (chain === 'etc') return 'etc' as const
  if (chain === 'ecns') return 'ecns' as const

  // Previews
  if (segments.length === 4) {
    if (segments[0] === 'test') {
      return 'mainnet' as const
    }
    if (segments.slice(1).join('.') === 'ens-app-v3.pages.dev') {
      return 'sepolia' as const
    }
  }

  // Dev environment - default to ECNS mode
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    if (process.env.NEXT_PUBLIC_PROVIDER) return 'localhost' as const
    return 'ecns' as const // Multi-chain ECNS mode
  }

  // ECNS domains
  if (hostname.includes('ecns')) {
    return 'ecns' as const
  }

  return match(segments[0])
    .with('sepolia', () => 'sepolia' as const)
    .with('mordor', () => 'mordor' as const)
    .otherwise(() => 'ecns' as const) // Default to ECNS multi-chain
}

// Get chains based on network mode
// For ECNS: return both Mordor AND ETC mainnet (multi-chain)
// For ENS: return single chain as before
export const getChainsFromUrl = () => {
  const network = getNetworkFromUrl()
  return match(network)
    .with('mainnet', () => [mainnetWithEns])
    .with('sepolia', () => [sepoliaWithEns])
    .with('localhost', () => [localhostWithEns])
    .with('mordor', () => [mordorWithEcns]) // Single chain mode
    .with('etc', () => [etcMainnetWithEcns]) // Single chain mode
    .with('ecns', () => ecnsChains) // Multi-chain: Mordor + ETC mainnet
    .otherwise(() => ecnsChains) // Default to ECNS multi-chain
}

// Check if current mode is ECNS (ETC ecosystem)
export const isEcns = isEcnsMode
