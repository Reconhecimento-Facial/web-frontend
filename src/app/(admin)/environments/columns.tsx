'use client'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { FilterOption } from '@/components/ui/data-table-filter'
import { useRouter } from 'next/navigation'
import { User } from '../users/columns'

import dayjs from '@/lib/dayjs'

export type Environment = {
  id: string
  name: string
  groups: FilterOption[]
  last_access: {
    user: User
    access_at: Date
  }
  created_at: Date
}

export const columns: ColumnDef<Environment>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    enableSorting: true,
  },
  {
    accessorKey: 'groups',
    header: 'Grupos',
    cell: ({ row }) => {
      const groupsToShown = row.original.groups.slice(0, 3)
      const diff = row.original.groups.length - 3

      return (
        <>
          {groupsToShown.map((g) => g.label).join(', ')}{' '}
          {diff > 0 && (
            <div className="mx-auto w-fit text-xs text-muted-foreground">
              {`+${diff} ${diff > 1 ? 'Grupos' : 'Grupo'} `}
            </div>
          )}
        </>
      )
    },
    meta: {
      style: {
        align: 'center',
      },
    },
    enableSorting: false,
  },
  {
    accessorKey: 'last_access',
    header: 'Último acesso',
    enableSorting: false,
    cell: ({ row }) => {
      return `${row.original.last_access.user.name} | ${dayjs(row.original.last_access.access_at).format('DD MMM [de] YYYY [ás] HH:mm')}`
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { push } = useRouter()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => push(`/environments/${row.original.id}`)}
            >
              Ver Perfil
            </DropdownMenuItem>

            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
