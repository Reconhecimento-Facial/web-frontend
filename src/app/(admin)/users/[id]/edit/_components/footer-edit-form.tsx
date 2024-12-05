import { Button } from '@/components/ui/button'

export function FooterEditForm() {
  return (
    <div className="col-span-full mt-4 flex justify-between">
      <Button variant={'destructive'}>Excluir</Button>
      <div>
        <Button variant={'outline'}>Cancelar</Button>
        <Button className="ml-2">Salvar</Button>
      </div>
    </div>
  )
}
