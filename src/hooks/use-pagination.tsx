import { useQueryStates } from 'nuqs'

import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
} from 'nuqs/server'

export const paginationParams = {
  pageIndex: parseAsInteger.withDefault(0),
  pageSize: parseAsInteger.withDefault(10),
}

export const paginationCache = createSearchParamsCache(paginationParams)
export const serialize = createSerializer(paginationParams)

export function usePagination() {
  return useQueryStates(paginationParams, {
    history: 'push',
    shallow: false,
  })
}
