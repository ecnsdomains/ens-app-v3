import type { Address, Chain } from 'viem'

import { ChainWithEns } from '@ensdomains/ensjs/contracts'

// Mordor testnet chain definition (ETC testnet)
export const mordor = {
  id: 63,
  name: 'Mordor',
  nativeCurrency: { name: 'Mordor Ether', symbol: 'METC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.mordor.etccooperative.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://etc-mordor.blockscout.com',
    },
  },
  testnet: true,
} as const satisfies Chain

// ETC Mainnet chain definition
export const etcMainnet = {
  id: 61,
  name: 'Ethereum Classic',
  nativeCurrency: { name: 'Ether', symbol: 'ETC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://etc.rivet.cloud'] },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://etc.blockscout.com',
    },
  },
  testnet: false,
} as const satisfies Chain

// ECNS contract addresses on Mordor testnet
// Deployed: 2026-02-06
export const ecnsMordorAddresses = {
  ECNSRegistry: '0x298195a795a5fe91bb47db1c4e501f07767775c8' as Address,
  ReverseRegistrar: '0xab9ffcf5ccaaf0f276a7c9813d57a8418e7e9f6a' as Address,
  DefaultReverseRegistrar: '0xe5230571856f9e4a15f5e9c4655b220b32a081b1' as Address,
  BaseRegistrar: '0x4d5e3a1e5dfbc98783ecbc91e6be2233fbf2978e' as Address,
  ETCswapFullOracle: '0x430198d8f9a854e90210d3df98294453f3a9b875' as Address,
  ExponentialPremiumPriceOracle: '0xf16140598170236cdbbc309b9357d5785c88c2e8' as Address,
  ETCRegistrarController: '0x13ff083bfd8377ea8e5a013e58662132cdb78ecb' as Address,
  PublicResolver: '0xf8ee21672f4077354091aa5b1a147fde25ae81bc' as Address,
} as const

// ETC Mainnet contract addresses - TO BE DEPLOYED
// Placeholder addresses until mainnet deployment
export const ecnsMainnetAddresses = {
  ECNSRegistry: '0x0000000000000000000000000000000000000000' as Address,
  ReverseRegistrar: '0x0000000000000000000000000000000000000000' as Address,
  DefaultReverseRegistrar: '0x0000000000000000000000000000000000000000' as Address,
  BaseRegistrar: '0x0000000000000000000000000000000000000000' as Address,
  ETCswapFullOracle: '0x0000000000000000000000000000000000000000' as Address,
  ExponentialPremiumPriceOracle: '0x0000000000000000000000000000000000000000' as Address,
  ETCRegistrarController: '0x0000000000000000000000000000000000000000' as Address,
  PublicResolver: '0x0000000000000000000000000000000000000000' as Address,
} as const

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as Address

// Helper to create ECNS chain config
const createEcnsChain = <T extends Chain>(
  chain: T,
  addresses: typeof ecnsMordorAddresses,
): ChainWithEns<T> => ({
  ...chain,
  contracts: {
    // Core registry
    ensRegistry: {
      address: addresses.ECNSRegistry,
    },
    // Base registrar
    ensBaseRegistrarImplementation: {
      address: addresses.BaseRegistrar,
    },
    // Controller
    ensEthRegistrarController: {
      address: addresses.ETCRegistrarController,
    },
    // Resolvers
    ensPublicResolver: {
      address: addresses.PublicResolver,
    },
    // Reverse registrar
    ensReverseRegistrar: {
      address: addresses.ReverseRegistrar,
    },
    ensDefaultReverseRegistrar: {
      address: addresses.DefaultReverseRegistrar,
    },
    // Not deployed in ECNS (use zero address)
    ensUniversalResolver: {
      address: ZERO_ADDRESS,
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11' as Address, // Standard multicall3
    },
    ensDnsRegistrar: {
      address: ZERO_ADDRESS,
    },
    ensNameWrapper: {
      address: ZERO_ADDRESS,
    },
    ensBulkRenewal: {
      address: ZERO_ADDRESS,
    },
    ensDnssecImpl: {
      address: ZERO_ADDRESS,
    },
    legacyEthRegistrarController: {
      address: ZERO_ADDRESS,
    },
    legacyPublicResolver: {
      address: ZERO_ADDRESS,
    },
    wrappedEthRegistrarController: {
      address: ZERO_ADDRESS,
    },
    wrappedPublicResolver: {
      address: ZERO_ADDRESS,
    },
    wrappedBulkRenewal: {
      address: ZERO_ADDRESS,
    },
  },
  subgraphs: {
    ens: {
      // No subgraph yet - direct RPC queries only
      url: '',
    },
  },
})

// Mordor with ECNS contracts
export const mordorWithEcns = createEcnsChain(mordor, ecnsMordorAddresses)

// ETC Mainnet with ECNS contracts (placeholder until deployment)
export const etcMainnetWithEcns = createEcnsChain(etcMainnet, ecnsMainnetAddresses)

// Export all ECNS chains
export const ecnsChains = [mordorWithEcns, etcMainnetWithEcns] as const
