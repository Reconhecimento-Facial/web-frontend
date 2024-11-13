'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HistoryPanel } from './history-panel'
import { AllowedUsersPanel } from './allowed-users-panel'
import { parseAsInteger, useQueryState } from 'nuqs'
import { Pagination } from '@/components/ui/pagination'
import { useEnvironmentHistory } from '@/hooks/use-environment-history'
import { useAllowedUsers } from '@/hooks/use-allowed-users'

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

  const { data: envHistory } = useEnvironmentHistory(
    environmentId,
    pageIndex,
    activePanel === 'history',
  )

  const { data: allowedUsers } = useAllowedUsers(
    environmentId,
    pageIndex,
    activePanel === 'allowed-users',
  )

  return (
    <>
      <Tabs
        value={activePanel}
        onValueChange={(val) => {
          setActivePanel(val)
          setPageIndex(0)
        }}
        defaultValue="history"
        className="w-[400px]"
      >
        <TabsList>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="allowed-users">Usuários Permitidos</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <HistoryPanel history={envHistory?.data || []} />
        </TabsContent>
        <TabsContent value="allowed-users">
          <AllowedUsersPanel allowedUsers={allowedUsers?.data || []} />
        </TabsContent>
      </Tabs>
      <Pagination
        className="mt-4"
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        totalPages={envHistory?.totalPages || 0}
      />
    </>
  )
}
