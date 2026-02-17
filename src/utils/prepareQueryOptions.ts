import {
  DataTag,
  DefinedInitialDataOptions,
  QueryKey,
  UndefinedInitialDataOptions,
} from '@tanstack/react-query'

export function prepareQueryOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
): UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey> & {
  queryKey: DataTag<TQueryKey, TQueryFnData, TError>
}
export function prepareQueryOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
): DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey> & {
  queryKey: DataTag<TQueryKey, TQueryFnData, TError>
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- implementation signature must be compatible with all overloads
export function prepareQueryOptions(options: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mirrors implementation param type
  const newOptions = {} as Record<string, any>
  for (const key in options) {
    if (options[key] !== undefined) {
      newOptions[key] = options[key]
    }
  }
  return newOptions
}
