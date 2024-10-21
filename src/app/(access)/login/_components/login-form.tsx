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

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Campo obrigatório' })
    .email('Informe um email válido'),
  password: z.string({ required_error: 'Campo obrigatório' }),
})

export const LoginForm: NextComponentType = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = () => {
    console.log('form submitted')
  }

  return (
    <Form {...form}>
      <form className="mx-auto max-w-md" onSubmit={form.handleSubmit(onSubmit)}>
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input placeholder="Insira sua senha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Link href="/account-recovery" className="mt-4 inline-block text-sm">
            Esqueci minha senha
          </Link>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </CardFooter>
      </form>
    </Form>
  )
}
