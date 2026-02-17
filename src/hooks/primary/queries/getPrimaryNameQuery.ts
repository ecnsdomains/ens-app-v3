import { readContract } from '@wagmi/core'
import { Address, getChainContractAddress, zeroAddress } from 'viem'

import { universalResolverReverseSnippet } from '@ensdomains/ensjs/contracts'

import { ConfigWithEns } from '@app/types'
import { getCoderByCoinTypeWithTestnetSupport } from '@app/utils/records'

export type GetPrimaryNameQueryReturnType = {
  name: string
  address: Address
  coinType: number
  coinName: string
} | null

export const getPrimaryNameQuery =
  (config: ConfigWithEns) =>
  async ({
    address,
    coinType = 60,
  }: {
    address: Address
    coinType?: number
  }): Promise<GetPrimaryNameQueryReturnType> => {
    try {
      const client = config.getClient()
      const resolverAddress = getChainContractAddress({
        chain: client.chain,
        contract: 'ensUniversalResolver',
      })

      // Guard: UniversalResolver not deployed on ECNS chains (Mordor/ETC mainnet)
      if (!resolverAddress || resolverAddress === zeroAddress) {
        return null
      }

      const result = await readContract(config, {
        address: resolverAddress,
        abi: universalResolverReverseSnippet,
        functionName: 'reverse',
        args: [address, BigInt(coinType)],
      })
      return {
        name: result[0],
        address,
        coinType,
        coinName: getCoderByCoinTypeWithTestnetSupport(coinType).name,
      }
    } catch {
      return null
    }
  }
