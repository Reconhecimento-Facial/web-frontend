import { User } from '@/models/user'
import { Pagination } from '@/models/utils'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ColumnFilter } from '@tanstack/react-table'
import { useSession } from 'next-auth/react'

export const useUsers = (
  pagination: { pageIndex: number; pageSize: number },
  sorting: { id: string; desc: boolean },
  filters: ColumnFilter[],
) => {
  const { data: sessionData } = useSession()

  return useQuery({
    queryKey: ['users', pagination, sorting, filters],
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
        if (f.id === 'name') params.set('name', String(f.value))
        else if (f.id === 'status') params.set('status', String(f.value))
      })

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users?${params.toString()}`,
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

      return data as Pagination<User>
    },
  })
}
