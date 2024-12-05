'use client'

import { Table } from '@tanstack/react-table'
import { User } from '../columns'
import { ChangeEvent } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { DataTableFilter } from '@/components/ui/data-table-filter'
import { Input } from '@/components/ui/input'
import { statusOptions, userGroupOptions } from '@/lib/data'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

interface DataTableToolbarProps {
  table: Table<User>
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
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
    <div className="mb-6 flex flex-wrap items-stretch justify-between gap-4">
      <div className="flex flex-wrap items-stretch gap-4 md:min-w-[700px]">
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
            options={userGroupOptions}
          />
        )}
      </div>
      <div>
        <Link href={'/users/add'} className={buttonVariants()}>
          Adicionar Usuário
        </Link>
      </div>
    </div>
  )
}
