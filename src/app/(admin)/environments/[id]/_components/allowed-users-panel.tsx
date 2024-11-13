import { User } from '@/app/(admin)/users/columns'
import { User as UserIcon } from 'lucide-react'

interface AllowedUsersProps {
  allowedUsers: User[]
}

export function AllowedUsersPanel({ allowedUsers }: AllowedUsersProps) {
  return (
    <div className="space-y-4">
      {allowedUsers.map((u) => (
        <AllowedUsersEntry key={u.id} user={u} />
      ))}
    </div>
  )
}

function AllowedUsersEntry({ user }: { user: User }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <UserIcon className="mr-2 h-5 w-5" />
        <span>{user.name}</span>
      </div>
      <span className="text-gray-500">teste</span>
    </div>
  )
}
