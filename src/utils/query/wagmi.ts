import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {
  type Chain,
  createClient,
  formatTransactionRequest,
  type ExactPartial,
  type FallbackTransport,
  type HttpTransport,
  type TransactionRequest,
  type TransactionType,
  type Transport,
} from 'viem'
import { createStorage, fallback, http } from 'wagmi'
import { localhost, mainnet, sepolia } from 'wagmi/chains'

import { ccipRequest } from '@ensdomains/ensjs/utils'

import { getChainsFromUrl, SupportedChain } from '@app/constants/chains'
import { etcMainnet, mordor } from '@app/utils/chains/makeMordorChainWithEcns'

import { isInsideSafe } from '../safe'

const isLocalProvider = !!process.env.NEXT_PUBLIC_PROVIDER

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '903fdda1ea5a7d7a342a5d4c7891fa84'

const tenderlyKey = process.env.NEXT_PUBLIC_TENDERLY_KEY || '4imxc4hQfRjxrVB2kWKvTo'
const drpcKey = process.env.NEXT_PUBLIC_DRPC_KEY || 'AnmpasF2C0JBqeAEzxVO8aRuvzLTrWcR75hmDonbV6cR'

const tenderlyUrl = (chainName: string) => `https://${chainName}.gateway.tenderly.co/${tenderlyKey}`
export const drpcUrl = (chainName: string) =>
  `https://lb.drpc.org/ogrpc?network=${
    chainName === 'mainnet' ? 'ethereum' : chainName
  }&dkey=${drpcKey}`

type SupportedUrlFunc = typeof drpcUrl | typeof tenderlyUrl

const initialiseTransports = <const UrlFuncArray extends SupportedUrlFunc[]>(
  chainName: string,
  urlFuncArray: UrlFuncArray,
) => {
  const transportArray: HttpTransport[] = []

  for (const urlFunc of urlFuncArray) transportArray.push(http(urlFunc(chainName)))

  return fallback(transportArray)
}

export const prefix = 'wagmi'

const localStorageWithInvertMiddleware = (): Storage | undefined => {
  if (typeof window === 'undefined') return undefined
  const storage = window.localStorage
  const isMatchingKey = (key: string) => {
    if (!key.startsWith(prefix)) return false
    if (!key.endsWith('.disconnected')) return false
    return true
  }
  return {
    ...storage,
    getItem: (key_) => {
      if (!isMatchingKey(key_)) return storage.getItem(key_)

      const key = key_.replace('.disconnected', '.connected')
      const connectedStatus = storage.getItem(key)
      return connectedStatus ? null : 'true'
    },
    removeItem: (key_) => {
      if (!isMatchingKey(key_)) return storage.removeItem(key_)

      const key = key_.replace('.disconnected', '.connected')
      storage.setItem(key, 'true')
    },
    setItem: (key_, value) => {
      if (!isMatchingKey(key_)) return storage.setItem(key_, value)

      const key = key_.replace('.disconnected', '.connected')
      storage.removeItem(key)
    },
  }
}

// ETC RPC URLs
const mordorRpcUrl = 'https://rpc.mordor.etccooperative.org'
const etcMainnetRpcUrl = 'https://etc.rivet.link'

export const transports = {
  ...(isLocalProvider
    ? ({
        [localhost.id]: http(process.env.NEXT_PUBLIC_PROVIDER!) as unknown as FallbackTransport,
      } as const)
    : ({} as unknown as {
        // this is a hack to make the types happy, dont remove pls
        [localhost.id]: HttpTransport
      })),
  [mainnet.id]: initialiseTransports('mainnet', [drpcUrl, tenderlyUrl]),
  [sepolia.id]: initialiseTransports('sepolia', [drpcUrl, tenderlyUrl]),
  [mordor.id]: fallback([http(mordorRpcUrl)]),
  [etcMainnet.id]: fallback([http(etcMainnetRpcUrl)]),
} as const

// This is a workaround to fix MetaMask defaulting to the wrong transaction type
// when no type is specified, but an access list is provided.
// See: https://github.com/MetaMask/core/issues/5720
const formatExtraTransactionRequestParameters = (
  request:
    | { type: TransactionType }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    | { type: TransactionType; __is_metamask: boolean }
    | ExactPartial<TransactionRequest>,
) => {
  // 1: Call will never have `from`
  if (!('from' in request)) {
    // 1a: Default behaviour when not MetaMask
    if (!('__is_metamask' in request) || !request.__is_metamask) return {}
    // 1b: Add `type` to the request
    return {
      type: request.type,
    }
  }
  // 2: Standard call to formatter
  return formatTransactionRequest(request)
}

const chains = getChainsFromUrl().map((c) => ({
  ...c,
  formatters: {
    ...((c as { formatters?: object }).formatters || {}),
    transactionRequest: {
      format: formatExtraTransactionRequestParameters,
    },
  },
})) as unknown as readonly [SupportedChain, ...SupportedChain[]]

// Reown AppKit WagmiAdapter — replaces manual createConfig + RainbowKit connectors
const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks: chains,
  transports,
  storage: createStorage({ storage: localStorageWithInvertMiddleware(), key: prefix }),
  syncConnectedChain: false,
  multiInjectedProviderDiscovery: !isInsideSafe(),
  client: ({ chain }: { chain: Chain }) => {
    const chainId = chain.id as keyof typeof transports

    return createClient<Transport, typeof chain>({
      chain,
      batch: {
        multicall: {
          batchSize: 8196,
          wait: 50,
        },
      },
      transport: (params) => transports[chainId]({ ...params }),
      ccipRead: {
        request: ccipRequest(chain),
      },
    })
  },
} as any) // WagmiAdapter types may not expose all createConfig options, but they're passed through

// Initialize Reown AppKit — wallet modal with social login, email, and standard wallets
createAppKit({
  adapters: [wagmiAdapter],
  networks: chains as unknown as [SupportedChain, ...SupportedChain[]],
  projectId,
  metadata: {
    name: 'ECNS',
    description: 'Ethereum Classic Name Service',
    url: 'https://ecns.domains',
    icons: ['https://ecns.domains/icon.png'],
  },
  features: {
    email: true,
    socials: ['google', 'discord', 'apple', 'github', 'farcaster'],
    emailShowWallets: true,
  },
  themeMode: 'dark',
  themeVariables: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '--w3m-accent': '#3FB68B',
  },
})

// Type-assert the config to preserve chain literal types that WagmiAdapter loses
// Runtime: correct chains are passed via `networks: chains` above
// Types: Config<AppChains> ensures useChainId() returns SupportedChain['id'] literal union
type AppChains = readonly [SupportedChain, ...SupportedChain[]]

export const wagmiConfig = wagmiAdapter.wagmiConfig as unknown as import('wagmi').Config<AppChains> & {
  _isEns: true
}

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
