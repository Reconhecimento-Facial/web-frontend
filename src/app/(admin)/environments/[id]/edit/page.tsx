import { Environment } from '@/models/environment'
import { EnvironmentForm } from '../../_components/environment-form'
import { FooterEditForm } from './_components/footer-edit-form'
import { auth } from '@/auth'

import { fetchEnvironment } from '@/hooks/data/fetch-environment'
import { Metadata } from 'next'

type Props = {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const session = await auth()
  const environmentId = params.id

  if (!session?.access_token) return { title: 'Erro inesperado' }

  const response = await fetchEnvironment(
    Number(environmentId),
    session?.access_token,
  )

  if (!response.ok) return { title: 'Ambiente não encontrado' }

  const environment = (await response.json()) as Environment

  return {
    title: `Edição - ${environment.name}`,
  }
}

export default async function EditPage({ params }: Props) {
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

  return (
    <div className="p-6">
      <h2 className="mb-4 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Editar Ambiente
      </h2>
      <EnvironmentForm
        environment={{
          name: environment.name,
          photo: environment.photo_url,
          id: environment.id,
        }}
        footerSlot={<FooterEditForm environmentId={Number(environmentId)} />}
      />
    </div>
  )
}
