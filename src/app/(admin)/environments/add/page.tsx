import { EnvironmentForm } from '../_components/environment-form'

export default function AddPage() {
  return (
    <div className="p-6">
      <h2 className="mb-4 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Adicionar Ambiente
      </h2>
      <EnvironmentForm />
    </div>
  )
}
