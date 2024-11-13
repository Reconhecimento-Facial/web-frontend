import { User as UserIcon } from 'lucide-react'
import dayjs from '@/lib/dayjs'
import { EnvironmentHistory } from '@/hooks/use-environment-history'

interface HistoryPanelProps {
  history: EnvironmentHistory[]
}

export function HistoryPanel({ history }: HistoryPanelProps) {
  return (
    <div className="space-y-4">
      {history.map((h) => (
        <HistoryEntry {...h} key={h.user.id} />
      ))}
    </div>
  )
}

function HistoryEntry({ user, accessAt }: EnvironmentHistory) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <UserIcon className="mr-2 h-5 w-5" />
        <span>{user.name}</span>
      </div>
      <span className="text-gray-500">
        {dayjs(accessAt).format('DD MMM [de] YYYY [ás] HH:mm')}
      </span>
    </div>
  )
}
