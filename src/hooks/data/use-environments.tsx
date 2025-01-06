import { Environment } from '@/models/environment'
import { Pagination } from '@/models/utils'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

export function useInfiniteEnvironments() {
  const { data: session } = useSession()

  return useInfiniteQuery({
    queryKey: ['environments'],
    queryFn: async ({
      pageParam,
    }: {
      pageParam: number
    }): Promise<Pagination<Environment> | undefined> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/environments?page=${pageParam}&size=${100}`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        },
      )

      if (res.status !== 200) return undefined

      return res.json() as Promise<Pagination<Environment>>
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
