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

import { useRouter } from 'next/navigation'

import { Environment } from '@/models/environment'
import Link from 'next/link'
import { useDeleteEnvironment } from '@/hooks/data/use-delete-environment'
import { useToast } from '@/hooks/use-toast'
import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export const columns: ColumnDef<Environment>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    enableSorting: true,
  },

  {
    accessorKey: 'last_access',
    header: 'Último acesso',
    enableSorting: false,
    cell: () => {
      return <div></div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const queryClient = useQueryClient()
      const { toast } = useToast()
      const { push } = useRouter()

      const onSuccess = useCallback(() => {
        toast({
          variant: 'default',
          description: 'Ambiente excluído com sucesso!',
        })

        queryClient.invalidateQueries({ queryKey: ['environments'] })
      }, [toast, queryClient])

      const onError = useCallback(() => {
        toast({
          variant: 'destructive',
          title: 'Ops! Algo de errado ocorreu.',
          description: 'Por favor, tente novamente mais tarde.',
        })
      }, [toast])

      const { mutate } = useDeleteEnvironment(onSuccess, onError)

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

            <DropdownMenuItem>
              <Link href={`/environments/${row.original.id}/edit`}>Editar</Link>
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
