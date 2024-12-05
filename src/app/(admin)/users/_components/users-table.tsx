'use client'

import { ComponentType } from 'react'

import { columns, User } from '../columns'

import { usePagination } from '@/hooks/use-pagination'

import { DataTable } from '@/components/ui/data-table'

import { useSorting } from '@/hooks/use-sorting'
import { useFilter } from '@/hooks/use-filters'

import { DataTableToolbar } from './data-table-toolbar'

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
