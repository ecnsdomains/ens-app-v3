import { useMemo } from 'react'
import { useClient } from 'wagmi'

import { createSubgraphClient } from '@ensdomains/ensjs/subgraph'

export const useSubgraphClient = () => {
  const client = useClient()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => {
    // ECNS chains have no subgraph — return null to disable graph polling
    const url = (client?.chain as Record<string, any>)?.subgraphs?.ens?.url
    if (!url) return null
    return createSubgraphClient({ client })
  }, [client.chain.id])
}
