import { UserInputs } from '@/app/(admin)/users/_components/user-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import { format } from 'date-fns'
import { User } from '@/models/user'

export function useEditUser() {
  const { data: sessionData } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: Partial<UserInputs> & { id: number }) => {
      if (!sessionData) throw new Error('You are not authorized')

      const body = new FormData()

      if (formData.environmentIds && formData.environmentIds.length) {
        formData.environmentIds.forEach((e) =>
          body.append('environment_ids', e),
        )
      }

      body.set('id', String(formData.id))
      body.set('name', formData.name || '')
      body.set('email', formData.email || '')
      body.set(
        'date_of_birth',
        formData.dateOfBirth ? format(formData.dateOfBirth, 'yyyy-MM-dd') : '',
      )
      body.set('cpf', formData.cpf || '')
      body.set('phone_number', formData.phoneNumber || '')
      body.set('status', formData.status || '')

      if (formData.photo && (formData.photo as FileList).length) {
        body.set('photo', formData.photo[0])
      } else {
        body.set('photo', '')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${sessionData.access_token}`,
        },
        body,
      })
      if (!response.ok) {
        throw new Error('An error occurred')
      }

      return (await response.json()) as { message: string; user_updated: User }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
