import { normalizeCoinAddress } from '@app/utils/coin'
import { getCoderByCoinNameWithTestnetSupport } from '@app/utils/records'

export const validateCryptoAddress = ({
  coin,
  address,
}: {
  coin: string
  address: string | undefined
}) => {
  try {
    if (!address) return 'addressRequired'
    const _address = normalizeCoinAddress({ coin, address })
    const coinTypeInstance = getCoderByCoinNameWithTestnetSupport(coin)
    coinTypeInstance.decode(_address)
    return true
  } catch (e: unknown) {
    if (typeof e === 'string') return e
    if (e instanceof Error) return e.message
    if (typeof e === 'object' && e !== null && 'reason' in e) return String((e as { reason: unknown }).reason)
    return 'Invalid address'
  }
}
