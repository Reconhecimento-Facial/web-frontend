'use client'

import { CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useMaskito } from '@maskito/react'
import { maskitoTransform } from '@maskito/core'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib/utils'
import { MultiSelect } from '@/components/ui/multi-select'
import {
  environmentGroupOptions,
  environmentOptions,
  userGroupOptions,
} from '@/lib/data'
import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { userFormSchema } from './utils'
import { z } from 'zod'
import dayjs from '@/lib/dayjs'
import { cpfMask } from '@/components/input-config'

type UserInputs = z.infer<typeof userFormSchema>

const defaultValues: Omit<UserInputs, 'photo'> = {
  cpf: '',
  name: '',
  email: '',
  environments: [],
  askUser: false,
  groups: [],
  dateOfBirth: new Date(),
}

type UserFormProps = {
  className?: string
  initialValues?: Partial<UserInputs>
  footerSlot?: React.ReactNode
}

export function UserForm({
  className,
  initialValues,
  footerSlot,
}: UserFormProps) {
  const form = useForm<UserInputs>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      cpf: maskitoTransform(initialValues?.cpf || '', cpfMask),
    },
    reValidateMode: 'onChange',
  })

  const onSubmit = () => {
    console.log('Submissão feita')
  }

  const fileRef = form.register('photo')
  const cpfInputRef = useMaskito({ options: cpfMask })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log('errors', errors, form.getValues())
        })}
        className={cn('grid grid-cols-3 gap-4', className)}
      >
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
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Data de nascimento</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'flex w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        dayjs(field.value).format('LL')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto para reconhecimento</FormLabel>
                <FormControl>
                  <Input
                    type={'file'}
                    placeholder="Insira o email do usuário"
                    {...fileRef}
                    onChange={(event) => {
                      field.onChange(event.target?.files?.[0] ?? undefined)
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="askUser"
            render={({ field }) => (
              <div className="items-top flex space-x-2">
                <Checkbox
                  id="askUser"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="askUser"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Solicitar foto ao usuário por email
                  </label>
                </div>
              </div>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="groups"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grupos</FormLabel>
              <FormControl>
                <MultiSelect
                  options={userGroupOptions}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Selecione os grupos"
                  variant="inverted"
                  maxCount={2}
                />
              </FormControl>
              <FormDescription>
                Escolha os grupos a qual o usuário pertence
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="environments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ambientes</FormLabel>
              <FormControl>
                <MultiSelect
                  options={environmentGroupOptions.concat(environmentOptions)}
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

        {footerSlot || (
          <div className="col-span-full ml-auto mt-4 flex justify-end">
            <Button variant={'outline'} type="button">
              Cancelar
            </Button>
            <Button className="ml-2" type="submit">
              Adicionar
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
