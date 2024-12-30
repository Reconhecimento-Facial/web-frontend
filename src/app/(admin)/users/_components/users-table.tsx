'use client'

import { ComponentType } from 'react'

import { columns } from '../columns'

import { DataTable } from '@/components/ui/data-table'

import { DataTableToolbar } from './data-table-toolbar'
import {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import { User } from '@/models/user'

type UsersTableProps = {
  onSortingChange: OnChangeFn<SortingState>
  onPaginationChange: OnChangeFn<PaginationState>
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
  users: User[]
  totalCount: number
  sorting: SortingState
  pagination: PaginationState
  filters: ColumnFiltersState
  isPending?: boolean
}

export const UsersTable: ComponentType<UsersTableProps> = ({
  users,
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
        data={users}
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
