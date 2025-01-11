'use client'

import { Button } from '@/components/ui/button'
import { useDeleteEnvironment } from '@/hooks/data/use-delete-environment'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useFormState } from 'react-hook-form'

export function FooterEditForm({ environmentId }: { environmentId: number }) {
  const { toast } = useToast()
  const { isDirty, isSubmitting } = useFormState()

  const { push } = useRouter()

  const onSuccess = useCallback(() => {
    toast({
      variant: 'default',
      description: 'Ambiente excluído com sucesso!',
    })
    push('/environments')
  }, [toast, push])

  const onError = useCallback(() => {
    toast({
      variant: 'destructive',
      title: 'Ops! Algo de errado ocorreu.',
      description: 'Por favor, tente novamente mais tarde.',
    })
  }, [toast])

  const { mutate, isPending } = useDeleteEnvironment(onSuccess, onError)

  return (
    <div className="col-span-full mt-4 flex justify-between">
      <Button
        loading={isPending}
        disabled={isPending || isSubmitting}
        onClick={() => mutate(environmentId)}
        variant={'destructive'}
        type="button"
      >
        Excluir
      </Button>
      <div>
        <Button
          type="button"
          onClick={() => push('/environments')}
          disabled={isPending || isSubmitting}
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
