import { useClient } from 'wagmi'

/**
 * Returns true if the current chain has a configured subgraph URL.
 * ECNS chains (Mordor/ETC mainnet) have no subgraph — returns false.
 */
export const useHasSubgraph = () => {
  const client = useClient()
  const url = (client?.chain as Record<string, any>)?.subgraphs?.ens?.url
  return typeof url === 'string' && url.length > 0
}
