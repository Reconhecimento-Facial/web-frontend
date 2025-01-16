import { auth } from '@/auth'
import { UserForm } from '../../_components/user-form'
import { FooterEditForm } from './_components/footer-edit-form'
import { User } from '@/models/user'
import { Pagination } from '@/models/utils'
import { Environment } from '@/models/environment'

export default async function EditPage({ params }: { params: { id: string } }) {
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

  const user = (await response.json()) as User

  const userEnvironments = await fetchUserEnvironments(
    user.id,
    session.access_token,
  )

  return (
    <div className="p-6">
      <h2 className="mb-4 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Editar Usuário
      </h2>
      <UserForm
        user={{
          id: user.id,
          cpf: user.cpf,
          email: user.email,
          name: user.name,
          photo: user.photo_url,
          status: user.status,
          environmentIds: userEnvironments.items.map((e) => String(e.id)),
          phoneNumber: user.phone_number,
          dateOfBirth: new Date(user.date_of_birth),
        }}
        footerSlot={<FooterEditForm userId={user.id} />}
      />
    </div>
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
