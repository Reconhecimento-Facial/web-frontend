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

import { UserStatus } from './utils'
import { Badge } from '@/components/ui/badge'
import { FilterOption } from '@/components/ui/data-table-filter'

export type User = {
  id: string
  name: string
  email: string
  status: UserStatus
  groups: FilterOption[]
  last_access: {
    environment: FilterOption
    access_at: Date
  }
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
    cell: ({ row }) => (
      <Badge
        variant={row.original.status.value === 'active' ? 'default' : 'outline'}
      >
        {row.original.status.label}
      </Badge>
    ),
    meta: {
      style: {
        align: 'center',
      },
    },
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
      return row.original.last_access.environment.label
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original

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
              onClick={() => navigator.clipboard.writeText(payment.id)}
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
