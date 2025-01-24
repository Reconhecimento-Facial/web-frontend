import { User as UserIcon } from 'lucide-react'
import { format } from 'date-fns'
import { EnvironmentHistory } from '@/models/environment'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface HistoryPanelProps {
  history: EnvironmentHistory[]
  loading?: boolean
}

export function HistoryPanel({ history, loading }: HistoryPanelProps) {
  if (!history.length && !loading)
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
          <th className="p-4 pb-3 pl-8 pt-0 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
            Acesso
          </th>
          <th className="p-4 pb-3 pl-8 pt-0 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
            Horário
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
              <td>
                <Skeleton className="mt-4 h-6" />
              </td>
              <td>
                <Skeleton className="mt-4 h-6" />
              </td>
            </tr>
          ))}
        {!loading &&
          history.map((h) => <HistoryEntry {...h} key={h.user.id} />)}
      </tbody>
    </table>
  )
}

function HistoryEntry({ user, allowed, accessAt }: EnvironmentHistory) {
  return (
    <tr>
      <td className="flex items-center gap-2 p-4 pb-3 pl-8 pt-4 text-left font-medium text-gray-600 dark:border-gray-600 dark:text-gray-200">
        <UserIcon className="mr-2 h-5 w-5" />
        <span>{user.name}</span>
      </td>
      <td className="text-center">
        <Badge variant={allowed ? 'outline' : 'destructive'}>
          {allowed ? 'Autorizado' : 'Negado'}
        </Badge>
      </td>
      <td className="p-4 pb-3 pl-8 pt-0 text-left font-medium text-gray-400 dark:border-gray-600 dark:text-gray-200">
        {format(accessAt, "dd MMM 'de' yyyy 'ás' HH:mm", { locale: ptBR })}
      </td>
    </tr>
  )
}
