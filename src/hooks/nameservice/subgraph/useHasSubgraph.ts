import { useClient } from 'wagmi'

/**
 * Returns true if the current chain has a configured subgraph URL.
 * ECNS chains (Mordor/ETC mainnet) have no subgraph — returns false.
 */
export const useHasSubgraph = () => {
  const client = useClient()
  const chain = client?.chain as { subgraphs?: { ens?: { url?: string } } } | undefined
  const url = chain?.subgraphs?.ens?.url
  return typeof url === 'string' && url.length > 0
}
