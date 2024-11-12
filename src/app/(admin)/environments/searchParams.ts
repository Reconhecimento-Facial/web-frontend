import { filtersParser } from '@/hooks/use-filters'
import { paginationParams } from '@/hooks/use-pagination'
import { sortingParams } from '@/hooks/use-sorting'
import { createSearchParamsCache } from 'nuqs/server'

const searchParams = {
  filters: filtersParser,
  ...paginationParams,
  ...sortingParams,
}

export const searchParamsCache = createSearchParamsCache(searchParams)
