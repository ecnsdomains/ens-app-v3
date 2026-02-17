import { useMemo } from 'react'
import { useClient } from 'wagmi'

import { createSubgraphClient } from '@ensdomains/ensjs/subgraph'

export const useSubgraphClient = () => {
  const client = useClient()
  return useMemo(() => {
    // ECNS chains have no subgraph — return null to disable graph polling
    const chain = client?.chain as { subgraphs?: { ens?: { url?: string } } } | undefined
    const url = chain?.subgraphs?.ens?.url
    if (!url) return null
    return createSubgraphClient({ client })
  }, [client])
}
