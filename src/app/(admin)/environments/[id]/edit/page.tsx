import { Environment } from '@/models/environment'
import { EnvironmentForm } from '../../_components/environment-form'
import { FooterEditForm } from './_components/footer-edit-form'
import { auth } from '@/auth'
import { DEFAULT_ENVIRONMENT_IMAGE_URL } from '../page'

export default async function EditPage({ params }: { params: { id: string } }) {
  const session = await auth()

  if (!session?.user) return null

  const environmentId = params.id

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/environments/${environmentId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  )

  if (!response.ok) return null

  const environment = (await response.json()) as Environment

  const photo = environment.photo_url || DEFAULT_ENVIRONMENT_IMAGE_URL

  return (
    <div className="p-6">
      <h2 className="mb-4 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Editar Ambiente
      </h2>
      <EnvironmentForm
        environment={{ name: environment.name, photo, id: environment.id }}
        footerSlot={<FooterEditForm environmentId={Number(environmentId)} />}
      />
    </div>
  )
}
