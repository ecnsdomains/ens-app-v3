import type {
  PersistedClient,
  Persister,
  PersistQueryClientOptions,
} from '@tanstack/query-persist-client-core'
import type { OmitKeyof, QueryClient } from '@tanstack/react-query'
import { del, get, set } from 'idb-keyval'
import { deserialize } from 'wagmi'

import { serialize } from './serialize'

export const stringify = <TData = unknown>(data: TData) =>
  serialize(data, function innerReplacer(this: any, key) {
    const directValueReference = this[key]
    if (directValueReference instanceof Date)
      return { __type: 'Date', value: directValueReference.toISOString() }
  })

export const parse = <TData = unknown>(data: string) =>
  deserialize<TData>(data, (_key, value) => {
    if (value?.__type === 'Date') return new Date(value.value)
  })

function createIDBPersister(idbValidKey: IDBValidKey = 'reactQuery') {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, stringify(client))
    },
    restoreClient: async () => {
      const data = await get<string>(idbValidKey)
      return data ? parse<PersistedClient>(data) : undefined
    },
    removeClient: async () => {
      await del(idbValidKey)
    },
  } as Persister
}

const persister = () => createIDBPersister('wagmi.cache')

export const createPersistConfig = ({
  queryClient: _queryClient,
}: {
  queryClient: QueryClient
}): OmitKeyof<PersistQueryClientOptions, 'queryClient'> => ({
  persister: persister(),
  dehydrateOptions: {
    shouldDehydrateQuery: (query: any) =>
      query.gcTime !== 0 && query.queryHash !== JSON.stringify([{ entity: 'signer' }]),
  },
  buster: process.env.CONFIG_BUILD_ID,
})
