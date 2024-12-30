import { faker } from '@faker-js/faker'
import { FilterOption } from '@/components/ui/data-table-filter'
import { Group } from 'lucide-react'

faker.seed(42)

export type UserStatus = {
  value: 'active' | 'inactive'
  label: string
}

export const statusOptions: UserStatus[] = [
  {
    value: 'active',
    label: 'Ativo',
  },
  {
    value: 'inactive',
    label: 'Desativado',
  },
]

export const userGroupOptions: FilterOption[] = [
  {
    label: 'Coordenador',
    value: '1',
  },
  {
    label: 'RH',
    value: '2',
  },
  {
    label: 'Desenvolvedor',
    value: '3',
  },
  {
    label: 'Professor',
    value: '4',
  },
  {
    label: 'Aluno',
    value: '5',
  },
  {
    label: 'SECOMP',
    value: '6',
  },
]

export const environmentGroupOptions: FilterOption[] = [
  {
    label: 'Salas de Aula',
    value: '1',
    icon: <Group className="mr-2 h-4 w-4 text-muted-foreground" />,
  },
  {
    label: 'Laboratórios',
    value: '2',
    icon: <Group className="mr-2 h-4 w-4 text-muted-foreground" />,
  },
  {
    label: 'Escritórios',
    value: '3',
    icon: <Group className="mr-2 h-4 w-4 text-muted-foreground" />,
  },
  {
    label: 'Auditórios',
    value: '4',
    icon: <Group className="mr-2 h-4 w-4 text-muted-foreground" />,
  },
]

export const environments = [
  'Laboratório Richard Bellman',
  'Sala 3',
  'Mini Auditório',
  'Sala 2',
  'Sala 3',
  'Sala de Reuniões',
  'LACOMP',
  'Laboratório 1',
  'Laboratório 2',
  'Laboratório 3',
  'Laboratório 4',
]

export const environmentOptions: FilterOption[] = environments.map((e) => ({
  label: e,
  value: faker.string.uuid(),
}))
