import dayjs from '@/lib/dayjs'
import { NextPage } from 'next'
import Image from 'next/image'
import { EnvironmentPanels } from './_components/environment-panels'
import { buttonVariants } from '@/components/ui/button'
import { auth } from '@/auth'
import { Environment } from '@/models/environment'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface EnvironmentPageProps {
  params: {
    id: string
  }
}

export const DEFAULT_ENVIRONMENT_IMAGE_URL = '/assets/environment-image.png'

const EnvironmentPage: NextPage<EnvironmentPageProps> = async ({ params }) => {
  const { id: environmentId } = params

  const session = await auth()

  if (!session?.user) return null

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

  if (!environment) return <div>Ambiente não encontrado</div>

  const image = environment.photo_url || DEFAULT_ENVIRONMENT_IMAGE_URL

  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
      <div className="">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {environment.name}
        </h2>
        <Image
          className="mt-4"
          width={345}
          height={170}
          src={image}
          alt="Imagem do ambiente"
        />
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

export default EnvironmentPage
