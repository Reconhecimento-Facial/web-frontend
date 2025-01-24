import dayjs from '@/lib/dayjs'
import { Metadata } from 'next'

import { EnvironmentPanels } from './_components/environment-panels'
import { buttonVariants } from '@/components/ui/button'
import { auth } from '@/auth'
import { Environment } from '@/models/environment'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { fetchEnvironment } from '@/hooks/data/fetch-environment'
import { ThemedImage } from '@/components/themed-image'
import { DARK_IMAGE_PLACEHOLDER, LIGHT_IMAGE_PLACEHOLDER } from '@/lib/image'

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
    title: environment.name,
  }
}

export default async function EnvironmentPage({ params }: Props) {
  const { id: environmentId } = params

  const session = await auth()

  if (!session?.user) return null

  const response = await fetchEnvironment(
    Number(environmentId),
    session.access_token,
  )

  if (!response.ok) return null

  const environment = (await response.json()) as Environment

  if (!environment) return <div>Ambiente não encontrado</div>

  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
      <div className="">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {environment.name}
        </h2>

        <div className="mt-4 h-[170px] w-[345px]">
          <ThemedImage
            width={345}
            height={170}
            srcLight={environment.photo_url || LIGHT_IMAGE_PLACEHOLDER}
            srcDark={environment.photo_url || DARK_IMAGE_PLACEHOLDER}
            alt="Imagem do ambiente"
          />
        </div>

        <div className="mt-4 space-y-4">
          <GridItem label="Dispositivo" value={'teste'} />

          <GridItem
            label="Cadastrado em"
            value={dayjs(environment.created_at).format('DD/MM/YYYY')}
          />
        </div>
        <Link
          href={`/environments/${environment.id}/edit`}
          className={cn(buttonVariants({ variant: 'outline' }), 'mt-4')}
        >
          Editar
        </Link>
      </div>

      <div className="">
        <EnvironmentPanels environmentId={environmentId} />
      </div>
    </div>
  )
}

function GridItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <p className="mt-1">{value}</p>
    </div>
  )
}
