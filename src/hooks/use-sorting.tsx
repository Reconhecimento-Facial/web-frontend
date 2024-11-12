import { useQueryStates } from 'nuqs'

import { parseAsString, parseAsBoolean } from 'nuqs/server'

export const sortingParams = {
  sortKey: parseAsString.withDefault(''),
  sortDesc: parseAsBoolean.withDefault(false),
}

export function useSorting() {
  return useQueryStates(sortingParams, {
    history: 'push',
    shallow: false,
  })
}
