import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

export function useDeleteUser(onSuccess?: () => void, onError?: () => void) {
  const { data: sessionData } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: number) => {
      if (!sessionData) throw new Error('You are not authorized')

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
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
