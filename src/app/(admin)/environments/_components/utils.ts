import { validatePhoto } from '@/lib/validate'
import { z } from 'zod'

export const DEFAULT_ENVIRONMENT_IMAGE_URL = '/assets/environment-image.png'

export const environmentFormSchema = z.object({
  name: z.string({}),
  photo: z
    .any()
    .optional()
    .refine(
      (f) => !f || !f.length || validatePhoto(f) === true,
      (val: FileList) => {
        const response = validatePhoto(val)

        if (response === true) return { message: undefined }

        return { message: response }
      },
    ),
})
