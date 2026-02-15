import { Address } from 'viem'
import { useReadContract } from 'wagmi'

import { useAddressRecord } from './nameservice/public/useAddressRecord'

// TODO: Configure oracle per chain — this ENS name only resolves on Ethereum mainnet
const ORACLE_NAME = 'eth-usd.data.eth'

/** @deprecated Use useNativeCoinPrice instead */
export const useEthPrice = useNativeCoinPrice

export function useNativeCoinPrice() {
  const { data: address_ } = useAddressRecord({
    name: ORACLE_NAME,
  })

  const address = (address_?.value as Address) || undefined

  return useReadContract({
    abi: [
      {
        inputs: [],
        name: 'latestAnswer',
        outputs: [{ name: '', type: 'int256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    address,
    functionName: 'latestAnswer',
  })
}
