import { fakeEnvironments } from '@/lib/data'
import dayjs from '@/lib/dayjs'
import { NextPage } from 'next'
import Image from 'next/image'
import { EnvironmentPanels } from './_components/environment-panels'
import { Button } from '@/components/ui/button'

interface EnvironmentPageProps {
  params: {
    id: string
  }
}

const EnvironmentPage: NextPage<EnvironmentPageProps> = ({ params }) => {
  const { id: environmentId } = params

  const environment = fakeEnvironments.find((e) => e.id === environmentId)

  if (!environment) return <div>Ambiente não encontrado</div>

  return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
      <div className="">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {environment.name}
        </h2>
        <Image
          className="mt-4"
          width={345}
          height={170}
          src={'/assets/environment-image.png'}
          alt="Imagem do ambiente"
        />
        <div className="mt-4 space-y-4">
          <GridItem label="Dispositivo" value={'teste'} />
          <GridItem
            label="Grupos"
            value={environment.groups.map((g) => g.label).join(', ')}
          />
          <GridItem
            label="Cadastrado em"
            value={dayjs(environment.created_at).format('DD/MM/YYYY')}
          />
        </div>
        <Button className="mt-4" variant={'outline'}>
          Editar
        </Button>
      </div>

      <div className="">
        <EnvironmentPanels />
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
