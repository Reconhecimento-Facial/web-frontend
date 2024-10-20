import { faker } from '@faker-js/faker'
import { User } from './columns'
import { FilterOption } from '@/components/ui/data-table-faceted-filter'

export type UserStatus = {
  value: 'active' | 'deactive'
  label: string
}

export const statusOptions: UserStatus[] = [
  {
    value: 'active',
    label: 'Ativo',
  },
  {
    value: 'deactive',
    label: 'Desativado',
  },
]

export const groupOptions: FilterOption[] = [
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

export const environmentOptions: FilterOption[] = [
  {
    label: 'Laboratório Richard Bellman',
    value: '1',
  },
  {
    label: 'Sala 3',
    value: '2',
  },
  {
    label: 'Mini Auditório',
    value: '3',
  },
]

faker.seed(42)

export const fakeUsers: User[] = Array.from({ length: 52 }).map((_, index) => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const email = faker.internet.email({ firstName, lastName })

  const groupStartIndex = faker.number.int({
    min: 0,
    max: groupOptions.length - 4,
  })
  let groupEndIndex = faker.number.int({
    min: groupStartIndex,
    max: groupOptions.length,
  })

  if (groupStartIndex - groupEndIndex === 0) groupEndIndex += 1

  return {
    name: `${firstName} ${lastName}`,
    email,
    id: faker.string.uuid(),
    status: statusOptions[index % 2],
    groups: groupOptions.slice(groupStartIndex, groupEndIndex),
    last_access: {
      environment: environmentOptions[index % 3],
      access_at: faker.date.between({ from: '2018-01-01', to: Date.now() }),
    },
  }
})
