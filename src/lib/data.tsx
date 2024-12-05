import { faker } from '@faker-js/faker'
import { FilterOption } from '@/components/ui/data-table-filter'
import { User } from '@/app/(admin)/users/columns'
import { Environment } from '@/app/(admin)/environments/columns'
import { Group } from 'lucide-react'

faker.seed(42)

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

export const fakeUsers: User[] = Array.from({ length: 52 }).map((_, index) => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const email = faker.internet.email({ firstName, lastName })

  const groupStartIndex = faker.number.int({
    min: 0,
    max: environmentGroupOptions.length - 4,
  })

  let groupEndIndex = faker.number.int({
    min: groupStartIndex,
    max: environmentGroupOptions.length,
  })

  if (groupStartIndex - groupEndIndex === 0) groupEndIndex += 1

  return {
    id: faker.string.uuid(),
    name: `${firstName} ${lastName}`,
    email,
    cpf: faker.string.numeric(11),
    dateOfBirth: faker.date.birthdate(),
    status: statusOptions[index % 2],
    groups: environmentGroupOptions.slice(groupStartIndex, groupEndIndex),
    photo_uploaded_at:
      index % 2
        ? faker.date.between({ from: '2018-01-01', to: Date.now() })
        : null,
    last_access: {
      environment: environmentOptions[index % 3],
      access_at: faker.date.between({ from: '2018-01-01', to: Date.now() }),
    },
  }
})

export const fakeEnvironments: Environment[] = environmentOptions.map((e) => {
  const groupStartIndex = faker.number.int({
    min: 0,
    max: userGroupOptions.length - 4,
  })

  const groupEndIndex = faker.number.int({
    min: groupStartIndex + 1,
    max: userGroupOptions.length + 1,
  })

  const createdAt = faker.date.between({
    from: '2016-01-01',
    to: '2018-01-01',
  })

  return {
    id: e.value,
    name: e.label,
    groups: userGroupOptions.slice(groupStartIndex, groupEndIndex),
    last_access: {
      user: fakeUsers[
        faker.number.int({
          min: 0,
          max: fakeUsers.length - 1,
        })
      ],
      access_at: faker.date.between({ from: createdAt, to: Date.now() }),
    },
    created_at: createdAt,
  }
})
