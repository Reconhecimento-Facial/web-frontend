'use client'

import { Button } from '@/components/ui/button'
import { useDeleteUser } from '@/hooks/data/use-delete-user'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useFormState } from 'react-hook-form'

export function FooterEditForm({ userId }: { userId: number }) {
  const { toast } = useToast()
  const { isDirty, isSubmitting } = useFormState()

  const { push } = useRouter()

  const onSuccess = useCallback(() => {
    toast({
      variant: 'default',
      description: 'Usuário excluído com sucesso!',
    })
    push('/users')
  }, [toast, push])

  const onError = useCallback(() => {
    toast({
      variant: 'destructive',
      title: 'Ops! Algo de errado ocorreu.',
      description: 'Por favor, tente novamente mais tarde.',
    })
  }, [toast])

  const { mutate, isPending } = useDeleteUser(onSuccess, onError)

  return (
    <div className="col-span-full mt-4 flex justify-between">
      <Button
        loading={isPending}
        disabled={isPending || isSubmitting}
        onClick={() => mutate(userId)}
        type="button"
        variant={'destructive'}
      >
        Excluir
      </Button>
      <div>
        <Button
          type="button"
          disabled={isPending || isSubmitting}
          onClick={() => push('/users')}
          variant={'outline'}
        >
          Cancelar
        </Button>
        <Button
          disabled={isPending || isSubmitting || !isDirty}
          loading={isSubmitting}
          type="submit"
          className="ml-2"
        >
          Salvar
        </Button>
      </div>
    </div>
  )
}
