'use client'

import { DataTable } from '@/components/ui/data-table'
import { columns, User } from '../columns'

import { usePagination } from '@/hooks/usePagination'
import { ChangeEvent, ComponentType } from 'react'
import { useFilter, useSorting } from '../searchParams'
import { Input } from '@/components/ui/input'

import { useDebouncedCallback } from 'use-debounce'

import { Table } from '@tanstack/react-table'
import { groupOptions, statusOptions } from '../utils'
import { DataTableFilter } from '@/components/ui/data-table-filter'

type UsersTableProps = {
  users: User[]
  totalCount: number
}

export const UsersTable: ComponentType<UsersTableProps> = ({
  users,
  totalCount,
}) => {
  const [sorting, setSorting] = useSorting()
  const [pagination, setPagination] = usePagination()
  const [filters, setFilters] = useFilter()

  return (
    <div>
      <DataTable
        columns={columns}
        data={users}
        getRowId={(originalRow) => originalRow.id}
        pagination
        Toolbar={DataTableToolbar}
        onPaginationChange={setPagination}
        onSortingChange={(updater) => {
          const newSortingValue =
            updater instanceof Function
              ? updater([
                  {
                    desc: sorting.sortDesc,
                    id: sorting.sortKey,
                  },
                ])
              : updater

          if (!newSortingValue[0]) setSorting({ sortKey: '', sortDesc: false })
          else
            setSorting({
              sortDesc: newSortingValue[0].desc,
              sortKey: newSortingValue[0].id,
            })

          setPagination({ pageIndex: 0 })
        }}
        onColumnFiltersChange={(updater) => {
          const newColumnFiltersValue =
            updater instanceof Function ? updater(filters) : updater

          setFilters(newColumnFiltersValue)
          setPagination({ pageIndex: 0 })
        }}
        manualPagination
        manualSorting
        manualFiltering
        rowCount={totalCount}
        state={{
          sorting: [
            {
              desc: sorting.sortDesc,
              id: sorting.sortKey,
            },
          ],
          pagination,
          columnFilters: filters,
        }}
      />
    </div>
  )
}

interface DataTableToolbarProps {
  table: Table<User>
}

function DataTableToolbar({ table }: DataTableToolbarProps) {
  const nameColumn = table.getColumn('name')

  const handleSearch = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      nameColumn?.setFilterValue(e.target.value)
    },
    500,
  )

  const statusColumn = table.getColumn('status')
  const groupsColumn = table.getColumn('groups')

  return (
    <div className="mb-6 flex flex-wrap items-stretch justify-stretch gap-4">
      <Input
        className="max-w-sm"
        defaultValue={`${nameColumn?.getFilterValue() || ''}`}
        onChange={handleSearch}
        placeholder="Buscar usuário"
      />
      {statusColumn && (
        <DataTableFilter
          column={statusColumn}
          title="Status"
          options={statusOptions}
        />
      )}
      {groupsColumn && (
        <DataTableFilter
          column={groupsColumn}
          title="Grupos"
          options={groupOptions}
        />
      )}
    </div>
  )
}
