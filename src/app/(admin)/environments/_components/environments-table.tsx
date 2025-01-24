'use client'

import { ChangeEvent, ComponentType } from 'react'
import { columns } from '../columns'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { useDebouncedCallback } from 'use-debounce'
import {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
  Table,
} from '@tanstack/react-table'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { EnvironmentWithLastAccess } from '@/models/environment'

type EnvironmentsTableProps = {
  onSortingChange: OnChangeFn<SortingState>
  onPaginationChange: OnChangeFn<PaginationState>
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
  environments: Array<EnvironmentWithLastAccess>
  totalCount: number
  sorting: SortingState
  pagination: PaginationState
  filters: ColumnFiltersState
  isPending?: boolean
}

export const EnvironmentsTable: ComponentType<EnvironmentsTableProps> = ({
  environments,
  onPaginationChange,
  onSortingChange,
  onColumnFiltersChange,
  totalCount,
  sorting,
  pagination,
  filters,
  isPending,
}) => {
  return (
    <div>
      <DataTable
        columns={columns}
        data={environments}
        getRowId={(originalRow, index) => {
          return originalRow.id ? originalRow.id.toString() : index.toString()
        }}
        pagination
        Toolbar={DataTableToolbar}
        onPaginationChange={onPaginationChange}
        onSortingChange={onSortingChange}
        onColumnFiltersChange={onColumnFiltersChange}
        manualPagination
        manualSorting
        manualFiltering
        rowCount={totalCount}
        isPending={isPending}
        state={{
          sorting,
          pagination,
          columnFilters: filters,
        }}
      />
    </div>
  )
}

interface DataTableToolbarProps {
  table: Table<EnvironmentWithLastAccess>
}

function DataTableToolbar({ table }: DataTableToolbarProps) {
  const nameColumn = table.getColumn('name')

  const handleSearch = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      nameColumn?.setFilterValue(e.target.value)
    },
    500,
  )

  return (
    <div className="mb-6 flex flex-wrap items-stretch justify-between gap-4">
      <div className="flex flex-wrap items-stretch gap-4 md:min-w-[700px]">
        <Input
          className="max-w-sm"
          defaultValue={`${nameColumn?.getFilterValue() || ''}`}
          onChange={handleSearch}
          placeholder="Buscar ambiente"
        />
      </div>
      <div>
        <Link href={'/environments/add'} className={buttonVariants()}>
          Adicionar Ambiente
        </Link>
      </div>
    </div>
  )
}
