import { useQueryStates } from 'nuqs'

import { parseAsString, parseAsBoolean } from 'nuqs/server'

export const sortingParams = {
  id: parseAsString.withDefault(''),
  desc: parseAsBoolean.withDefault(false),
}

export function useSorting() {
  return useQueryStates(sortingParams, {
    history: 'push',
    shallow: true,
  })
}
