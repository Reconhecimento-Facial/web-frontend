/* eslint-disable react-hooks/rules-of-hooks */
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

import { Badge } from '@/components/ui/badge'

import Link from 'next/link'
import { UserWithLastAccess } from '@/models/user'
import { useCallback } from 'react'

import { useToast } from '@/hooks/use-toast'
import { useDeleteUser } from '@/hooks/data/use-delete-user'
import { useQueryClient } from '@tanstack/react-query'

export const columns: ColumnDef<UserWithLastAccess>[] = [
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
      <Badge variant={row.original.status === 'active' ? 'default' : 'outline'}>
        {row.original.status === 'active' ? 'Ativo' : 'Desativado'}
      </Badge>
    ),
    meta: {
      style: {
        align: 'center',
      },
    },
  },
  {
    accessorKey: 'last_access',
    header: 'Último acesso',
    enableSorting: false,
    cell: ({ row }) => {
      const { last_accessed_environment_name: envName } = row.original

      if (!envName)
        return <span className="text-muted-foreground">Sem registro</span>

      return <div>{envName}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const queryClient = useQueryClient()
      const { toast } = useToast()

      const onSuccess = useCallback(() => {
        toast({
          variant: 'default',
          description: 'Usuário excluído com sucesso!',
        })

        queryClient.invalidateQueries({ queryKey: ['users'] })
      }, [toast, queryClient])

      const onError = useCallback(() => {
        toast({
          variant: 'destructive',
          title: 'Ops! Algo de errado ocorreu.',
          description: 'Por favor, tente novamente mais tarde.',
        })
      }, [toast])

      const { mutate } = useDeleteUser(onSuccess, onError)

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/users/${row.original.id}`} prefetch={false}>
                Ver Perfil
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href={`/users/${row.original.id}/edit`} prefetch={false}>
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => mutate(row.original.id)}
              className="text-destructive"
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
