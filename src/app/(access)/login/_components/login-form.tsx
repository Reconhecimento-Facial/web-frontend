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
import { signIn } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Campo obrigatório' })
    .email('Informe um email válido'),
  password: z.string({ required_error: 'Campo obrigatório' }),
})

type LoginInputs = z.infer<typeof loginSchema>

export const LoginForm: NextComponentType = () => {
  const form = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { isSubmitting } = form.formState

  const router = useRouter()

  const { toast } = useToast()

  const onSubmit = async (formData: LoginInputs) => {
    const response = await signIn('credentials', {
      ...formData,
      redirect: false,
    })

    const error = response?.error
    const code = response?.code

    if (!error) return router.replace('/users')

    if (code === 'invalid-credentials') {
      toast({
        variant: 'destructive',
        title: 'Credenciais inválidas',
        description: 'Por favor, verifique suas credenciais e tente novamente.',
      })
    } else {
      toast({
        variant: 'destructive',
        title: 'Ops! Algo de errado ocorreu.',
        description: 'Por favor, tente novamente mais tarde.',
      })
    }
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
                  <Input
                    type="password"
                    placeholder="Insira sua senha"
                    {...field}
                  />
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
          <Button loading={isSubmitting} type="submit" className="w-full">
            Entrar
          </Button>
        </CardFooter>
      </form>
    </Form>
  )
}
