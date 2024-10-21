'use client'

import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'

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
import { NextComponentType } from 'next'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const recoverySchema = z.object({
  email: z
    .string({ required_error: 'Campo obrigatório' })
    .email('Informe um email válido'),
  password: z.string({ required_error: 'Campo obrigatório' }),
})

export const RecoveryForm: NextComponentType = () => {
  const form = useForm({
    resolver: zodResolver(recoverySchema),
  })

  const onSubmit = () => {
    console.log('form submitted')
  }

  return (
    <Form {...form}>
      <form
        className="mx-auto max-w-md sm:max-w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CardContent className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Insira seu email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex-col items-start justify-start gap-y-8">
          <Button type="submit" className="w-full">
            Entrar
          </Button>
          <Link href="/login" className="mt-4 inline-block text-sm">
            Voltar ao login
          </Link>
        </CardFooter>
      </form>
    </Form>
  )
}
