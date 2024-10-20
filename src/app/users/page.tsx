import { NextPage } from 'next'

import { UsersTable } from './users-table'
import { fakeUsers } from './utils'

import { searchParamsCache } from './searchParams'
import { User } from './columns'

const UsersPage: NextPage<{
  searchParams: { [key: string]: string | string[] | undefined }
}> = ({ searchParams }) => {
  const { pageIndex, pageSize, sortKey, sortDesc, filters } =
    searchParamsCache.parse(searchParams)

  let users = sortKey
    ? fakeUsers.toSorted((a, b) => {
        if (sortKey === 'name') return sortUsersByName(a, b, sortDesc)

        return sortUsersByEmail(a, b, sortDesc)
      })
    : fakeUsers

  let nameFilter = ''
  let statusFilter: string[] = []
  let groupsFilter: string[] = []

  filters.forEach((f) => {
    switch (f.id) {
      case 'name':
        nameFilter = f.value as string
        break
      case 'status':
        statusFilter = f.value as string[]

        break
      case 'groups':
        groupsFilter = f.value as string[]
        break
      default:
        break
    }
  })

  const hasFilters = nameFilter || statusFilter.length || groupsFilter.length

  if (hasFilters)
    users = users.filter((u) => {
      if (
        nameFilter &&
        !u.name.toLowerCase().includes(nameFilter.toLowerCase())
      )
        return false

      if (statusFilter.length && !statusFilter.includes(u.status.value))
        return false

      if (
        groupsFilter.length &&
        !u.groups.some((g) => groupsFilter.includes(g.value))
      )
        return false

      return true
    })

  const totalCount = users.length

  users = users.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

  return (
    <div className="p-6">
      <UsersTable totalCount={totalCount} users={users} />
    </div>
  )
}

export default UsersPage

function sortUsersByName(a: User, b: User, desc: boolean) {
  if (desc) return a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1

  return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
}

function sortUsersByEmail(a: User, b: User, desc: boolean) {
  if (desc) return a.email.toLowerCase() > b.email.toLowerCase() ? -1 : 1

  return a.email.toLowerCase() > b.email.toLowerCase() ? 1 : -1
}
