import { fakeUsers } from '@/lib/data'
import { useQuery } from '@tanstack/react-query'

export function useAllowedUsers(
  id: string,
  pageIndex: number,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ['environments', id, 'allowed-users', pageIndex],
    enabled,
    queryFn: () => {
      const allowedUsers = fakeUsers.slice(pageIndex * 10, (pageIndex + 1) * 10)

      const totalPages = Math.ceil(allowedUsers.length / 10)

      return {
        data: allowedUsers,
        pageIndex,
        totalPages,
      }
    },
  })
}
