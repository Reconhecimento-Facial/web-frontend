import { SquareArrowOutUpRight, User, UserX } from 'lucide-react'
import { faker } from '@faker-js/faker'

import { environmentOptions, fakeUsers } from '@/lib/data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function UserProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const { id: userId } = params

  const user = fakeUsers.find((u) => u.id === userId)

  if (!user) return <div>Usuário não encontrado</div>

  const allowedEnvironmentsStartIndex = faker.number.int({
    min: 0,
    max: environmentOptions.length - 2,
  })

  const allowedEnvironmentsEndIndex = faker.number.int({
    min: allowedEnvironmentsStartIndex + 1,
    max: environmentOptions.length,
  })

  const allowedEnvironments = environmentOptions.slice(
    allowedEnvironmentsStartIndex,
    allowedEnvironmentsEndIndex,
  )

  return (
    <div className="space-y-6 p-6">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Perfil Usuário
      </h2>

      {!user.photo_uploaded_at && (
        <>
          <PhotoAlert />
          <Button variant={'link'}>Reenviar solicitação</Button>
        </>
      )}

      <div className="max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nome</label>
              <p className="mt-1">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">CPF</label>
              <p className="mt-1">{user.cpf}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Data de Nascimento
              </label>
              <p className="mt-1">
                {user.birth_date.toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Último acesso
              </label>
              <p className="mt-1 flex items-center">
                <span className="mr-2">
                  {user.last_access.environment.label}
                </span>
                {user.last_access.access_at.toLocaleDateString('pt-BR', {
                  
                })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Grupos que pertence
              </label>
              <p className="mt-1 flex items-center">
                {user.groups.length > 3 ? (
                  <ListDialog items={user.groups.map((g) => g.label)} />
                ) : (
                  user.groups.map((g) => g.label).join(', ')
                )}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Ambientes com acesso
              </label>
              <p className="mt-1">
                {allowedEnvironments.length > 3 ? (
                  <ListDialog items={allowedEnvironments.map((e) => e.label)} />
                ) : (
                  allowedEnvironments.map((e) => e.label).join(', ')
                )}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Cadastro
              </label>
              <p className="mt-1 flex items-center">
                <User className="mr-2 h-4 w-4 text-gray-400" />
                Kleber Jacinto às 15:35 de 09/10/24
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PhotoAlert() {
  return (
    <Alert variant={'destructive'}>
      <UserX className="h-4 w-4" />
      <AlertTitle>Cadastro pendente</AlertTitle>
      <AlertDescription>
        A foto para reconhecimento facial está pendente. Adicione manualmente ou
        envie uma nova solicitação ao usuário
      </AlertDescription>
    </Alert>
  )
}

function ListDialog({ items }: { items: string[] }) {
  return (
    <Dialog>
      <DialogTrigger className="flex items-center">
        Ver todos <SquareArrowOutUpRight className="ml-2" size={18} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grupos que o usuário pertence</DialogTitle>
          <DialogDescription>
            <ul className="ml-6 mt-4 list-disc">
              {items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
