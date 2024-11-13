import { User } from '@/app/(admin)/users/columns'
import { fakeUsers } from '@/lib/data'
import { faker } from '@faker-js/faker'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export interface EnvironmentHistory {
  user: User
  accessAt: Date
}

export function useEnvironmentHistory(
  id: string,
  pageIndex: number,
  enabled = true,
) {
  return useQuery({
    queryKey: ['environments', id, 'history', pageIndex],
    placeholderData: keepPreviousData,
    queryFn: () => {
      const users = fakeUsers.slice(pageIndex * 10, (pageIndex + 1) * 10)

      const data: EnvironmentHistory[] = users
        .map((u) => ({
          user: u,
          accessAt: faker.date.recent(),
        }))
        .sort((a, b) => (a.accessAt <= b.accessAt ? -1 : 1))

      const totalPages = Math.ceil(fakeUsers.length / 10)

      return {
        data,
        pageIndex,
        totalPages,
      }
    },
    enabled,
  })
}
