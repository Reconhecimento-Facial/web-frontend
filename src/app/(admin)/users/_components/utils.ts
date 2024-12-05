import { validateCPF, validatePhoto } from '@/lib/validate'
import { z } from 'zod'
import dayjs from '@/lib/dayjs'

export const userFormSchema = z
  .object({
    name: z.string({ required_error: 'Campo obrigatório' }),
    cpf: z
      .string({ required_error: 'Campo obrigatório' })
      .refine((value) => validateCPF(value), { message: 'CPF inválido' }),
    email: z
      .string({
        required_error: 'Campo obrigatório',
      })
      .email({ message: 'Email inválido' }),
    groups: z.array(z.string(), { required_error: 'Campo obrigatório' }),
    environments: z.array(z.string(), { required_error: 'Campo obrigatório' }),
    askUser: z.boolean(),
    photo: z.any().optional(),
    dateOfBirth: z
      .date()
      .min(dayjs().subtract(130, 'year').toDate(), {
        message: 'Selecione uma data válida',
      })
      .max(dayjs().startOf('day').toDate(), {
        message: 'Muito novo! Selecione uma data válida',
      }),
  })
  .superRefine(({ askUser, photo }, ctx) => {
    if (askUser) return true

    const message = validatePhoto(photo)

    if (message)
      return ctx.addIssue({
        code: 'custom',
        message,
        path: ['photo'],
      })
  })
