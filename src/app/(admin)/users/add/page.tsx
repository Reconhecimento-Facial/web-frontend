import { Metadata } from 'next'
import { UserForm } from '../_components/user-form'

export const metadata: Metadata = {
  title: 'Adicionar Usuário',
}

export default function AddPage() {
  return (
    <div className="p-6">
      <h2 className="mb-4 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Adicionar Usuário
      </h2>
      <UserForm />
    </div>
  )
}
