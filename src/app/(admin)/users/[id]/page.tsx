import { SquareArrowOutUpRight, User } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { auth } from '@/auth'
import { Pagination } from '@/models/utils'
import { Environment } from '@/models/environment'
import { User as UserType } from '@/models/user'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export default async function UserProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const { id: userId } = params

  const session = await auth()

  if (!session?.user) return null

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  )

  if (!response.ok) return null

  const user = (await response.json()) as UserType

  const userEnvironments = await fetchUserEnvironments(
    user.id,
    session.access_token,
  )

  return (
    <div className="space-y-6 p-6">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Perfil Usuário
      </h2>

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
                {new Date(user.date_of_birth).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <p className="mt-1">
                <span
                  data-inactive={user.status === 'inactive'}
                  className="text-green-900 data-[inactive=true]:text-red-900"
                >
                  {user.status === 'active' ? 'Ativo' : 'Desativado'}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Último acesso
              </label>
              <p className="mt-1 flex items-center">
                {/* <span className="mr-2">
                  {user.last_access.environment.label}
                </span>
                {user.last_access.access_at.toLocaleDateString('pt-BR', {})} */}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Ambientes com acesso
              </label>
              <p className="mt-1">
                {userEnvironments.items.length > 3 ? (
                  <ListDialog
                    items={userEnvironments.items.map((e) => e.name)}
                  />
                ) : (
                  userEnvironments.items.map((e) => e.name).join(', ')
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
        <Link
          href={`/users/${user.id}/edit`}
          className={cn(buttonVariants({ variant: 'outline' }), 'mt-4')}
        >
          Editar
        </Link>
      </div>
    </div>
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
          <DialogTitle>Ambientes autorizados</DialogTitle>
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

async function fetchUserEnvironments(userId: number, token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/environments/${userId}?size=100`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const data = (await response.json()) as Pagination<Environment>

  return data
}
