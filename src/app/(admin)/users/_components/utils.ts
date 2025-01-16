import { validateCPF, validatePhoto } from '@/lib/validate'
import { subYears } from 'date-fns'
import { z } from 'zod'

export const DEFAULT_USER_IMAGE_URL = '/assets/user-image.png'

export const userFormSchema = z.object({
  name: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, 'Campo obrigatório')
    .min(3, 'Nome muito curto'),
  cpf: z
    .string({ required_error: 'Campo obrigatório' })
    .refine((value) => validateCPF(value), { message: 'CPF inválido' }),
  status: z.enum(['active', 'inactive']).optional(),
  email: z
    .string({
      required_error: 'Campo obrigatório',
    })
    .email({ message: 'Email inválido' }),
  environmentIds: z.array(z.string(), {
    required_error: 'Campo obrigatório',
  }),
  phoneNumber: z
    .string({
      required_error: 'Campo obrigatório',
    })
    .min(1, 'Campo obrigatório'),

  photo: z.any().refine(
    (f) => validatePhoto(f) === true,
    (val: FileList) => {
      const response = validatePhoto(val)

      if (response === true) return { message: undefined }

      return { message: response }
    },
  ),
  dateOfBirth: z
    .date()
    .min(subYears(new Date(), 150), {
      message: 'Selecione uma data válida',
    })
    .max(new Date(), {
      message: 'Muito novo! Selecione uma data válida',
    }),
})
