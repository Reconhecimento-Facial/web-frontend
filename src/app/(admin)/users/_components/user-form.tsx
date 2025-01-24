'use client'

import { useForm } from 'react-hook-form'
import { useMaskito } from '@maskito/react'
import { maskitoTransform } from '@maskito/core'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'

import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib/utils'
import { MultiSelect } from '@/components/ui/multi-select'
import React, { useMemo, useState } from 'react'
import { DEFAULT_USER_IMAGE_URL, userFormSchema } from './utils'
import { z } from 'zod'

import { cpfMask, phoneNumberMask } from '@/components/input-config'
import { useInfiniteEnvironments } from '@/hooks/data/use-environments'
import { useCreateUser } from '@/hooks/data/use-create-user'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { format, startOfDay, subYears } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

import { useEditUser } from '@/hooks/data/use-edit-user'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getDirtyValues } from '@/lib/form'
import { ThemedImage } from '@/components/themed-image'
import { DARK_IMAGE_PLACEHOLDER, LIGHT_IMAGE_PLACEHOLDER } from '@/lib/image'

export type UserInputs = z.infer<typeof userFormSchema>

const defaultValues: Omit<UserInputs, 'photo'> = {
  cpf: '',
  name: '',
  email: '',
  status: 'active',
  environmentIds: [],
  dateOfBirth: new Date(),
  phoneNumber: '',
}

type UserFormProps = {
  className?: string
  user?: UserInputs & { id: number }
  footerSlot?: React.ReactNode
}

export function UserForm({ className, user, footerSlot }: UserFormProps) {
  const { toast } = useToast()
  const form = useForm<UserInputs>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      ...defaultValues,
      ...user,
      cpf: maskitoTransform(user?.cpf || '', cpfMask),
      phoneNumber: maskitoTransform(user?.phoneNumber || '', phoneNumberMask),
    },
    reValidateMode: 'onChange',
  })

  const [imagePreview, setImagePreview] = useState(
    user?.photo as string | undefined,
  )

  const { data } = useInfiniteEnvironments()

  const { mutateAsync: createUserAsync, isPending: isPendingCreateUser } =
    useCreateUser()

  const { mutateAsync: editUserAsync, isPending: isPendingEditUser } =
    useEditUser()

  const isPending = useMemo(
    () => isPendingCreateUser || isPendingEditUser,
    [isPendingCreateUser, isPendingEditUser],
  )

  const environmentOptions: { value: string; label: string }[] = React.useMemo(
    () =>
      data
        ? (data.pages
            .map((p) =>
              p?.items.map((i) => ({ value: String(i.id), label: i.name })),
            )
            .flat()
            .filter(Boolean) as { value: string; label: string }[])
        : [],
    [data],
  )

  const onSubmit = async (values: UserInputs) => {
    try {
      if (!user) {
        await createUserAsync(values)

        form.reset()

        toast({
          variant: 'default',
          description: 'Usuário criado com sucesso!',
        })

        setImagePreview(DEFAULT_USER_IMAGE_URL)
      } else {
        const dirtyValues = getDirtyValues(form.formState.dirtyFields, values)

        await editUserAsync({ ...dirtyValues, id: user.id })

        toast({
          variant: 'default',
          description: 'Usuário alterado com sucesso!',
        })

        form.reset(form.getValues())
      }
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Ops! Algo de errado ocorreu.',
        description: 'Por favor, tente novamente mais tarde.',
      })
    }
  }

  const fileRef = form.register('photo')
  const cpfInputRef = useMaskito({ options: cpfMask })
  const phoneNumberInputRef = useMaskito({ options: phoneNumberMask })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid grid-cols-[auto_1fr] gap-4', className)}
      >
        <div className="w-fit justify-self-start">
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="photo" required>
                  Foto para reconhecimento
                </FormLabel>
                <div className="mt-4 h-[170px] w-[345px]">
                  <ThemedImage
                    width={345}
                    height={170}
                    srcLight={imagePreview || LIGHT_IMAGE_PLACEHOLDER}
                    srcDark={imagePreview || DARK_IMAGE_PLACEHOLDER}
                    alt="Imagem do ambiente"
                  />
                </div>
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
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {user && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Ativado</SelectItem>
                      <SelectItem value="inactive">Desativado</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Insira o nome do usuário" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Insira o email do usuário" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>CPF</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Insira o CPF do usuário"
                    {...field}
                    ref={cpfInputRef}
                    onInput={(evt) => {
                      form.setValue('cpf', evt.currentTarget.value, {
                        shouldValidate: form.formState.isSubmitted,
                      })
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Nº de celular</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Insira o Nº de celular do usuário"
                    {...field}
                    ref={phoneNumberInputRef}
                    onInput={(evt) => {
                      form.setValue('phoneNumber', evt.currentTarget.value, {
                        shouldValidate: form.formState.isSubmitted,
                      })
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel required>Data de nascimento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, 'PPP', { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      autoFocus
                      startMonth={startOfDay(subYears(new Date(), 150))}
                      endMonth={startOfDay(new Date())}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="environmentIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ambientes</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={environmentOptions}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="Selecione os ambientes"
                    variant="inverted"
                    maxCount={2}
                  />
                </FormControl>
                <FormDescription>
                  Escolha os ambientes que o usuário tem acesso
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {footerSlot || (
          <div className="col-span-full ml-auto mt-4 flex justify-end">
            <Link
              href={'/users'}
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
