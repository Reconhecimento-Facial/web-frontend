'use client'

import { useForm } from 'react-hook-form'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'

import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib/utils'
import React, { useMemo, useState } from 'react'
import { DEFAULT_ENVIRONMENT_IMAGE_URL, environmentFormSchema } from './utils'
import { z } from 'zod'

import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { useCreateEnvironment } from '@/hooks/data/use-create-environment'
import Image from 'next/image'

import { useEditEnvironment } from '@/hooks/data/use-edit-environment'
import { getDirtyValues } from '@/lib/form'

export type EnvironmentInputs = z.infer<typeof environmentFormSchema>

const defaultValues: Omit<EnvironmentInputs, 'photo'> = {
  name: '',
}

type EnvironmentFormProps = {
  className?: string
  environment?: EnvironmentInputs & { id: number }
  footerSlot?: React.ReactNode
}

export function EnvironmentForm({
  className,
  environment,
  footerSlot,
}: EnvironmentFormProps) {
  const { toast } = useToast()
  const form = useForm<EnvironmentInputs>({
    resolver: zodResolver(environmentFormSchema),
    defaultValues: {
      ...defaultValues,
      ...environment,
    },
    reValidateMode: 'onChange',
  })

  const [imagePreview, setImagePreview] = useState(
    environment?.photo || DEFAULT_ENVIRONMENT_IMAGE_URL,
  )

  const {
    mutateAsync: createEnvironmentAsync,
    isPending: isPendingCreateUser,
  } = useCreateEnvironment()
  const { mutateAsync: editEnvironmentAsync, isPending: isPendingEditUser } =
    useEditEnvironment()

  const isPending = useMemo(
    () => isPendingCreateUser || isPendingEditUser,
    [isPendingCreateUser, isPendingEditUser],
  )

  const onSubmit = async (values: EnvironmentInputs) => {
    try {
      if (!environment) {
        await createEnvironmentAsync(values)
        toast({
          variant: 'default',
          description: 'Ambiente criado com sucesso!',
        })
        form.reset()
        setImagePreview(DEFAULT_ENVIRONMENT_IMAGE_URL)
      } else {
        const dirtyValues = getDirtyValues(form.formState.dirtyFields, values)

        await editEnvironmentAsync({ ...dirtyValues, id: environment.id })

        toast({
          variant: 'default',
          description: 'Ambiente alterado com sucesso!',
        })

        form.reset(form.getValues())
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Ops! Algo de errado ocorreu.',
        description: 'Por favor, tente novamente mais tarde.',
      })
    }
  }

  const fileRef = form.register('photo')

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid grid-cols-3 gap-4', className)}
      >
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => {
            return (
              <FormItem>
                <Image
                  className="mt-4"
                  width={345}
                  height={170}
                  src={imagePreview}
                  alt="Imagem do ambiente"
                />
                <FormLabel
                  htmlFor="photo"
                  className="cursor-pointer text-sm font-medium underline underline-offset-4 hover:text-primary"
                >
                  {field.value ? 'Alterar foto' : 'Adicionar foto'}
                </FormLabel>
                <FormControl>
                  <Input
                    id="photo"
                    type={'file'}
                    {...fileRef}
                    className="hidden"
                    onChange={(event) => {
                      field.onChange(event.target?.files ?? undefined)

                      const file = event.target.files?.[0]

                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Insira o nome do ambiente" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {footerSlot || (
          <div className="col-span-full ml-auto mt-4 flex justify-end">
            <Link
              href={'/environments'}
              className={buttonVariants({ variant: 'outline' })}
            >
              Cancelar
            </Link>

            <Button loading={isPending} className="ml-2" type="submit">
              Adicionar
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
