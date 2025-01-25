'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronsUpDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

import { signOut, useSession } from 'next-auth/react'

export function AppUserMenu() {
  const { data: session } = useSession()
  const user = session?.user

  const handleLogout = async () => {
    await signOut({ redirect: true, redirectTo: '/login' })
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={'/assets/avatar.png'} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <span className="truncate text-sm">{user.name}</span>

        <ChevronsUpDown className="ml-auto" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-muted-foreground">
          Minha conta
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
