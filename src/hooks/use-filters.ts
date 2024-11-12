import { ColumnFilter } from '@tanstack/react-table'
import { parseAsArrayOf, parseAsJson, useQueryState } from 'nuqs'

import { z } from 'zod'

const filterSchema: z.ZodType<ColumnFilter> = z.object({
  id: z.string(),
  value: z.string().or(z.array(z.string())),
})

export const filtersParser = parseAsArrayOf(parseAsJson(filterSchema.parse))
  .withDefault([])
  .withOptions({
    shallow: false,
    history: 'push',
  })

export function useFilter() {
  return useQueryState('filters', filtersParser)
}
