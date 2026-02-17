import { DefaultOptions, QueryClient } from '@tanstack/react-query'
import { hashFn } from 'wagmi/query'

// ETC block cadence: ~14s/block, queries every ~50 blocks (~11.7 min)
// 10 min staleTime aligns closely while being easy on RPC resources
const TEN_MINUTES = 1_000 * 60 * 10
const FIVE_MINUTES = 1_000 * 60 * 5

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      staleTime: TEN_MINUTES,
      gcTime: 1_000 * 60 * 60 * 24,
      queryKeyHashFn: hashFn,
    },
  },
})

export const refetchOptions: DefaultOptions<Error> = {
  queries: {
    refetchOnWindowFocus: true,
    refetchInterval: TEN_MINUTES,
    staleTime: FIVE_MINUTES,
    meta: {
      isRefetchQuery: true,
    },
    refetchOnMount: true,
    queryKeyHashFn: hashFn,
  },
}

export const queryClientWithRefetch = new QueryClient({
  queryCache: queryClient.getQueryCache(),
  defaultOptions: refetchOptions,
  mutationCache: queryClient.getMutationCache(),
})
