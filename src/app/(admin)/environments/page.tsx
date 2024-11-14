import { NextPage } from 'next'
import { EnvironmentsTable } from './_components/environments-table'
import { searchParamsCache } from './searchParams'

import { fakeEnvironments } from '@/lib/data'
import { Environment } from './columns'

const UsersPage: NextPage<{
  searchParams: { [key: string]: string | string[] | undefined }
}> = ({ searchParams }) => {
  const { pageIndex, pageSize, sortKey, sortDesc, filters } =
    searchParamsCache.parse(searchParams)

  let environments = sortKey
    ? fakeEnvironments.toSorted((a, b) =>
        sortEnvironmentsByName(a, b, sortDesc),
      )
    : fakeEnvironments

  let nameFilter = ''
  let groupsFilter: string[] = []

  filters.forEach((f) => {
    switch (f.id) {
      case 'name':
        nameFilter = f.value as string
        break
      case 'groups':
        groupsFilter = f.value as string[]
        break
      default:
        break
    }
  })

  const hasFilters = nameFilter || groupsFilter.length

  if (hasFilters)
    environments = environments.filter((e) => {
      console.log('env', e.name)
      if (
        nameFilter &&
        !e.name.toLowerCase().includes(nameFilter.toLowerCase())
      )
        return false

      if (
        groupsFilter.length &&
        !e.groups.some((g) => groupsFilter.includes(g.value))
      )
        return false

      return true
    })

  const totalCount = environments.length

  environments = environments.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize,
  )

  return (
    <div className="p-6">
      <h2 className="mb-4 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Ambientes
      </h2>
      <EnvironmentsTable environments={environments} totalCount={totalCount} />
    </div>
  )
}

function sortEnvironmentsByName(a: Environment, b: Environment, desc: boolean) {
  return desc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
}

export default UsersPage
