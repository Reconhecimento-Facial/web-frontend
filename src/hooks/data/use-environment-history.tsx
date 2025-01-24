import { EnvironmentHistory } from '@/models/environment'
import { Pagination } from '@/models/utils'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export function useEnvironmentHistory(
  environmentId: string,
  pageIndex: number,
  enabled: boolean,
) {
  return useQuery<Pagination<EnvironmentHistory>>({
    queryKey: ['environments', environmentId, 'logs', pageIndex],
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/environments/logs/${environmentId}?size=10&page=${pageIndex + 1}`,
      )

      if (!response.ok) throw new Error('An error occurred')

      const data = (await response.json()) as Pagination<{
        user_id: number
        user_name: string
        allowed_access: boolean
        access_time: string
      }>

      return {
        ...data,
        items: data.items.map((i) => ({
          user: {
            id: i.user_id,
            name: i.user_name,
          },
          accessAt: new Date(i.access_time),
          allowed: i.allowed_access,
        })),
      }
    },
  })
}
