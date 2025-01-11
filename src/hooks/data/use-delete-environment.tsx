import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

export function useDeleteEnvironment(
  onSuccess?: () => void,
  onError?: () => void,
) {
  const { data: sessionData } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (environmentId: number) => {
      if (!sessionData) throw new Error('You are not authorized')

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/environments/${environmentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${sessionData.access_token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error('An error occurred')
      }
    },
    onSuccess: () => {
      if (onSuccess) onSuccess()

      queryClient.invalidateQueries({ queryKey: ['environments'] })
    },
    onError,
  })
}
