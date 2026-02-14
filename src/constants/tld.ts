// TLD Configuration for ECNS
// This is used to determine the TLD based on chain

import { getChainsFromUrl } from './chains'

// Chain ID to TLD mapping
// Using Map to avoid ESLint naming convention issues with numeric keys
const CHAIN_TLD_MAP = new Map<number, string>([
  [1, 'eth'], // Ethereum Mainnet
  [11155111, 'eth'], // Sepolia
  [1337, 'eth'], // Localhost (hardhat)
  [63, 'etc'], // Mordor (ETC Testnet)
  [61, 'etc'], // Ethereum Classic Mainnet
])

// Get TLD for current chain
export const getCurrentTld = (): string => {
  const chains = getChainsFromUrl()
  const chainId = chains[0]?.id
  return CHAIN_TLD_MAP.get(chainId) || 'etc' // Default to 'etc' for ECNS
}

// Check if a name ends with the current chain's TLD
export const isEtcTld = (name: string): boolean => {
  return name.endsWith('.etc')
}

export const isEthTld = (name: string): boolean => {
  return name.endsWith('.eth')
}

// Check if a name uses the native TLD (not DNS)
export const isNativeTld = (name: string): boolean => {
  return name.endsWith('.eth') || name.endsWith('.etc')
}

// Get the TLD suffix
export const ETH_TLD = 'eth'
export const ETC_TLD = 'etc'
export const DEFAULT_TLD = 'etc' // ECNS default
