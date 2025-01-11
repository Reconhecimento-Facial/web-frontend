import { UserInputs } from '@/app/(admin)/users/_components/user-form'
import { useMutation } from '@tanstack/react-query'

import { User } from '@/models/user'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'

export function useCreateUser() {
  const { data: sessionData } = useSession()

  return useMutation({
    mutationFn: async (formData: UserInputs) => {
      if (!sessionData) throw new Error('You are not authorized')

      const body = new FormData()

      if (formData.environmentIds && formData.environmentIds.length) {
        formData.environmentIds.forEach((e) =>
          body.append('environment_ids', e),
        )
      }

      body.set('name', formData.name)
      body.set('email', formData.email)
      body.set('date_of_birth', format(formData.dateOfBirth, 'yyyy-MM-dd'))
      body.set('cpf', formData.cpf)
      body.set('phone_number', formData.phoneNumber)

      if ((formData.photo as FileList).length) {
        body.set('photo', formData.photo[0])
      } else {
        body.set('photo', '')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionData.access_token}`,
        },
        body,
      })

      if (!response.ok) {
        throw new Error('An error occurred')
      }

      const data = (await response.json()) as {
        message: string
        user_created: User
      }

      return data
    },
  })
}
