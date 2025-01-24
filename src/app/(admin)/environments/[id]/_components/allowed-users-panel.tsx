import { Skeleton } from '@/components/ui/skeleton'
import { User } from '@/models/user'
import { User as UserIcon } from 'lucide-react'

interface AllowedUsersProps {
  allowedUsers: Pick<User, 'id' | 'name'>[]
  loading?: boolean
}

export function AllowedUsersPanel({
  allowedUsers,
  loading,
}: AllowedUsersProps) {
  if (!loading && !allowedUsers.length)
    return (
      <div className="my-4 text-center text-sm text-muted-foreground">
        Nenhum registro encontrado
      </div>
    )

  return (
    <table className="w-full table-auto border-collapse text-sm">
      <thead>
        <tr>
          <th className="p-4 pb-3 pl-8 pt-0 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
            Nome
          </th>
        </tr>
      </thead>
      <tbody>
        {loading &&
          Array.from({ length: 10 }).map((_, i) => (
            <tr key={i}>
              <td>
                <Skeleton className="mt-4 h-6" />
              </td>
            </tr>
          ))}
        {!loading &&
          allowedUsers.map((u) => <AllowedUsersEntry key={u.id} user={u} />)}
      </tbody>
    </table>
  )
}

function AllowedUsersEntry({ user }: { user: Pick<User, 'id' | 'name'> }) {
  return (
    <tr>
      <td className="flex items-center gap-2 p-4 pb-3 pl-8 pt-4 text-left font-medium text-gray-600 dark:border-gray-600 dark:text-gray-200">
        <UserIcon className="mr-2 h-5 w-5" />
        <span>{user.name}</span>
      </td>
    </tr>
  )
}
