'use client'

import { ChangeEvent, ComponentType } from 'react'
import { columns, Environment } from '../columns'
import { useSorting } from '@/hooks/use-sorting'
import { usePagination } from '@/hooks/use-pagination'
import { useFilter } from '@/hooks/use-filters'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { useDebouncedCallback } from 'use-debounce'
import { Table } from '@tanstack/react-table'
import { DataTableFilter } from '@/components/ui/data-table-filter'
import { groupOptions } from '@/lib/data'
import { Button } from '@/components/ui/button'

type EnvironmentsTableProps = {
  environments: Environment[]
  totalCount: number
}

export const EnvironmentsTable: ComponentType<EnvironmentsTableProps> = ({
  environments,
  totalCount,
}) => {


  const [sorting, setSorting] = useSorting()
  const [pagination, setPagination] = usePagination()
  const [filters, setFilters] = useFilter()

  return (
    <div>
      <DataTable
        columns={columns}
        data={environments}
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
  table: Table<Environment>
}

function DataTableToolbar({ table }: DataTableToolbarProps) {
  const nameColumn = table.getColumn('name')

  const handleSearch = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      nameColumn?.setFilterValue(e.target.value)
    },
    500,
  )

  const groupsColumn = table.getColumn('groups')

  return (
    <div className="mb-6 flex flex-wrap items-stretch justify-between gap-4">
      <div className="flex flex-wrap items-stretch gap-4 md:min-w-[700px]">
        <Input
          className="max-w-sm"
          defaultValue={`${nameColumn?.getFilterValue() || ''}`}
          onChange={handleSearch}
          placeholder="Buscar usuário"
        />

        {groupsColumn && (
          <DataTableFilter
            column={groupsColumn}
            title="Grupos"
            options={groupOptions}
          />
        )}
      </div>
      <div>
        <Button>Adicionar Usuário</Button>
      </div>
    </div>
  )
}
