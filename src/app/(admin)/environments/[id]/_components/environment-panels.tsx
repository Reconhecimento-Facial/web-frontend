'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HistoryPanel } from './history-panel'
import { AllowedUsersPanel } from './allowed-users-panel'
import { parseAsInteger, useQueryState } from 'nuqs'
import { Pagination } from '@/components/ui/pagination'
import { useAllowedUsers } from '@/hooks/data/use-allowed-users'
import { useEnvironmentHistory } from '@/hooks/data/use-environment-history'

export function EnvironmentPanels({
  environmentId,
}: {
  environmentId: string
}) {
  const [activePanel, setActivePanel] = useQueryState('activePanel', {
    defaultValue: 'history',
  })

  const [pageIndex, setPageIndex] = useQueryState(
    'page',
    parseAsInteger.withDefault(0),
  )

  const { data: environmentHistory, isPending: isPendingEnvironmentHistory } =
    useEnvironmentHistory(environmentId, pageIndex, activePanel === 'history')

  const { data: allowedUsers, isPending: isPendingAllowedUsers } =
    useAllowedUsers(environmentId, pageIndex, activePanel === 'allowed-users')

  return (
    <>
      <Tabs
        value={activePanel}
        onValueChange={(val) => {
          setActivePanel(val)
          setPageIndex(0)
        }}
        defaultValue="history"
        className="w-full max-w-[600px]"
      >
        <TabsList>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="allowed-users">Usuários Permitidos</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <HistoryPanel
            loading={isPendingEnvironmentHistory}
            history={environmentHistory?.items || []}
          />
        </TabsContent>
        <TabsContent value="allowed-users">
          <AllowedUsersPanel
            loading={isPendingAllowedUsers}
            allowedUsers={allowedUsers?.items || []}
          />
        </TabsContent>
      </Tabs>
      <Pagination
        className="mt-4"
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        totalPages={
          activePanel === 'history'
            ? environmentHistory?.pages || 0
            : allowedUsers?.pages || 0
        }
      />
    </>
  )
}
