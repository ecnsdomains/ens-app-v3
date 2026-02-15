import type { TFunction } from 'i18next'
import { Address, getAddress } from 'viem'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { getResolver } from '@ensdomains/ensjs/public'
import { setAddressRecord } from '@ensdomains/ensjs/wallet'

import { getNativeCoinKey } from '@app/constants/tld'
import { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = {
  name: string
  address: Address
  latestResolver?: boolean
}

const displayItems = (
  { name, address, latestResolver }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'info',
    value: latestResolver
      ? t(`transaction.info.updateNativeCoinAddressOnLatestResolver`)
      : t(`transaction.info.updateNativeCoinAddress`),
  },
  {
    label: 'address',
    value: address,
    type: 'address',
  },
]

const transaction = async ({
  client,
  connectorClient,
  data,
}: TransactionFunctionParameters<Data>) => {
  const resolverAddress = data?.latestResolver
    ? getChainContractAddress({ client, contract: 'ensPublicResolver' })
    : await getResolver(client, { name: data.name })
  if (!resolverAddress) throw new Error('No resolver found')
  let address
  try {
    address = getAddress(data.address)
  } catch (e) {
    throw new Error('Invalid address')
  }
  return setAddressRecord.makeFunctionData(connectorClient, {
    name: data.name,
    resolverAddress,
    coin: getNativeCoinKey(),
    value: address,
  })
}

export default { displayItems, transaction } satisfies Transaction<Data>
