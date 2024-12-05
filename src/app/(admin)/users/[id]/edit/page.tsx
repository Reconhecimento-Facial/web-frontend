import { fakeUsers } from '@/lib/data'
import { UserForm } from '../../_components/user-form'
import { FooterEditForm } from './_components/footer-edit-form'

export default function EditPage({ params }: { params: { id: string } }) {
  const { id: userId } = params

  const user = fakeUsers.find((u) => u.id === userId)

  if (!user) return <div>Usuário não encontrado</div>

  console.log('USUARIO EDIT', user)

  return (
    <div className="p-6">
      <h2 className="mb-4 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Editar Usuário
      </h2>
      <UserForm
        initialValues={{ ...user, groups: user.groups.map((g) => g.value) }}
        footerSlot={<FooterEditForm />}
      />
    </div>
  )
}
