import { EnvironmentInputs } from '@/app/(admin)/environments/_components/environment-form'
import { Environment } from '@/models/environment'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

export function useCreateEnvironment() {
  const { data: sessionData } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: EnvironmentInputs) => {
      if (!sessionData) throw new Error('You are not authorized')

      const body = new FormData()

      body.set('name', formData.name)

      if ((formData.photo as FileList).length) {
        body.set('photo', formData.photo[0])
      } else {
        body.set('photo', '')
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/environments`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionData.access_token}`,
          },
          body,
        },
      )

      if (!response.ok) {
        throw new Error('An error occurred')
      }

      return (await response.json()) as Environment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environments'] })
    },
  })
}
