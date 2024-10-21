import { paginationParams } from '@/hooks/usePagination'
import { ColumnFilter } from '@tanstack/react-table'
import {
  parseAsArrayOf,
  parseAsJson,
  useQueryState,
  useQueryStates,
} from 'nuqs'

import {
  createSearchParamsCache,
  parseAsString,
  parseAsBoolean,
} from 'nuqs/server'
import { z } from 'zod'

const sortingParams = {
  sortKey: parseAsString.withDefault(''),
  sortDesc: parseAsBoolean.withDefault(false),
}

export function useSorting() {
  return useQueryStates(sortingParams, {
    history: 'push',
    shallow: false,
  })
}

const filterSchema: z.ZodType<ColumnFilter> = z.object({
  id: z.string(),
  value: z.string().or(z.array(z.string())),
})

const filtersParser = parseAsArrayOf(parseAsJson(filterSchema.parse))
  .withDefault([])
  .withOptions({
    shallow: false,
    history: 'push',
  })

export function useFilter() {
  return useQueryState('filters', filtersParser)
}

const searchParams = {
  filters: filtersParser,
  ...paginationParams,
  ...sortingParams,
}

export const searchParamsCache = createSearchParamsCache(searchParams)
