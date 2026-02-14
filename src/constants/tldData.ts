/* eslint-disable @typescript-eslint/naming-convention */
import { deploymentAddresses } from './chains'

export const CUSTOMIZED_TLDS = [] as const
export type CustomizedTLD = (typeof CUSTOMIZED_TLDS)[number]

// Zero address for chains without DNS registrar
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const DNS_REGISTRAR_ADDRESSES = {
  '1': '0xB32cB5677a7C971689228EC835800432B339bA2B',
  '11155111': '0x5a07C75Ae469Bf3ee2657B588e8E6ABAC6741b4f',
  '1337': deploymentAddresses.DNSRegistrar,
  '63': ZERO_ADDRESS, // Mordor (ECNS) - no DNS registrar
  '61': ZERO_ADDRESS, // ETC Mainnet - no DNS registrar
} as const
