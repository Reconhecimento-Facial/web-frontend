import { Pagination } from '@/models/utils'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

export function useAllowedUsers(
  environmentId: string,
  pageIndex: number,
  enabled: boolean,
) {
  const { data: sessionData } = useSession()

  return useQuery({
    queryKey: ['environments', environmentId, 'allowed-users', pageIndex],
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      if (!sessionData) throw new Error('You are not authorized')

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/environments/users/${environmentId}?size=10&page=${pageIndex + 1}`,
        {
          headers: {
            Authorization: `Bearer ${sessionData.access_token}`,
          },
        },
      )

      if (!response.ok) throw new Error('An error occurred')

      return (await response.json()) as Pagination<{
        id: number
        name: string
      }>
    },
  })
}
