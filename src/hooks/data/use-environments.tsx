import { EnvironmentWithLastAccess } from '@/models/environment'
import { Pagination } from '@/models/utils'
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'
import { ColumnFilter } from '@tanstack/react-table'
import { useSession } from 'next-auth/react'

export function useEnvironments(
  pagination: { pageIndex: number; pageSize: number },
  sorting: { id: string; desc: boolean },
  filters: ColumnFilter[],
) {
  const { data: sessionData } = useSession()

  return useQuery({
    queryKey: ['environments', pagination, sorting, filters],
    enabled: !!sessionData,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const params = new URLSearchParams()

      params.set('page', String(pagination.pageIndex + 1))
      params.set('size', String(pagination.pageSize))

      if (sorting.id) {
        params.set('sort_by', sorting.id)
        params.set(
          'sort_order',
          sorting.desc === true ? 'descending' : 'ascending',
        )
      }

      filters.forEach((f) => {
        params.set(f.id, String(f.value))
      })

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/environments?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionData?.access_token}`,
            accept: 'application/json',
          },
        },
      )

      if (response.status !== 200) return undefined

      const data = await response.json()

      return data as Pagination<EnvironmentWithLastAccess>
    },
  })
}

export function useInfiniteEnvironments() {
  const { data: session } = useSession()

  return useInfiniteQuery({
    queryKey: ['environments', 'infinite'],
    queryFn: async ({
      pageParam,
    }: {
      pageParam: number
    }): Promise<Pagination<EnvironmentWithLastAccess> | undefined> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/environments?page=${pageParam}&size=${100}`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        },
      )

      if (res.status !== 200) return undefined

      return res.json() as Promise<Pagination<EnvironmentWithLastAccess>>
    },
    enabled: !!session,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (!lastPage || lastPage.pages === 0) {
        return undefined
      }

      return lastPageParam + 1
    },
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined
      }

      return firstPageParam - 1
    },
  })
}
