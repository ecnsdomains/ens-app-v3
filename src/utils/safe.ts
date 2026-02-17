import { Hash } from 'viem'
import { Connector } from 'wagmi'

export const SAFE_ENDPOINT = 'https://safe-client.safe.global'

const checkIsWcConnector = (c: Connector | undefined): boolean => c?.type === 'walletConnect'
const checkIsSafeConnector = (c: Connector | undefined): boolean => c?.type === 'safe'

export type SafeAppType = 'iframe' | 'walletconnect'

export type CheckIsSafeAppReturnType = false | SafeAppType

export const checkIsSafeApp = async (
  connector: Connector | undefined,
): Promise<CheckIsSafeAppReturnType> => {
  const isWcConnector = checkIsWcConnector(connector)
  const isSafeConnector = checkIsSafeConnector(connector)

  if (!isWcConnector && !isSafeConnector) return false

  if (isSafeConnector) return 'iframe'

  const connectorProvider = (await connector!.getProvider()) as { session?: { peer: { metadata: { name: string; url: string } } } }
  const { session } = connectorProvider
  if (!session) return false

  const { name: peerName, url: peerUrl } = session.peer.metadata
  const cleanUrl = peerUrl.endsWith('/') ? peerUrl.slice(0, -1) : peerUrl
  if (peerName.startsWith('Safe') && cleanUrl === 'https://app.safe.global') return 'walletconnect'

  return false
}

type SafeTx = {
  safeAddress: string
  txId: string
  executedAt: number | null
  txStatus: string
  txInfo: {
    type: string
    to: object
    dataSize: string
    value: string
    methodName: string
    isCancellation: boolean
  }
  txData: {
    hexData: string
    dataDecoded: object
    to: object
    value: string
    operation: number
  }
  detailedExecutionInfo: {
    type: string
    submittedAt: number
    nonce: number
    safeTxGas: string
    baseGas: string
    gasPrice: string
    gasToken: string
    refundReceiver: object
    safeTxHash: string
    executor: object | null
    signers: object[]
    confirmationsRequired: number
    confirmations: object[]
    trusted: boolean
  }
  txHash: Hash | null
}

type SafeError = {
  code: number
  message: string
}

type SafeResponse = SafeTx | SafeError

export const fetchTxFromSafeTxHash = async ({
  chainId,
  safeTxHash,
}: {
  chainId: number
  safeTxHash: Hash
}): Promise<{ transactionHash: Hash } | null> => {
  const data: SafeResponse = await fetch(
    `${SAFE_ENDPOINT}/v1/chains/${chainId}/transactions/${safeTxHash}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    },
  ).then((res) => res.json())

  // error
  if ('code' in data) {
    console.error(data.message)
    return null
  }

  if (!data.txHash) return null

  return {
    transactionHash: data.txHash,
  }
}

// Only applies to Safe because of our CSP policy not allowing other iframes
export const isInsideSafe = () => typeof window !== 'undefined' && window !== window.parent
