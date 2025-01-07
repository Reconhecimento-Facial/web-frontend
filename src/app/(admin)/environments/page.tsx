'use client'

import { NextPage } from 'next'
import { EnvironmentsTable } from './_components/environments-table'

import { useSorting } from '@/hooks/use-sorting'
import { usePagination } from '@/hooks/use-pagination'
import { useFilter } from '@/hooks/use-filters'
import { useEnvironments } from '@/hooks/data/use-environments'

const EnvironmentsPage: NextPage = () => {
  const [sorting, setSorting] = useSorting()
  const [pagination, setPagination] = usePagination()
  const [filters, setFilters] = useFilter()

  const { data, isPending } = useEnvironments(pagination, sorting, filters)

  return (
    <div className="p-6">
      <h2 className="mb-4 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Ambientes
      </h2>
      <EnvironmentsTable
        isPending={isPending}
        environments={data?.items || []}
        totalCount={data?.total || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={[sorting]}
        onSortingChange={(updater) => {
          const newSortingValue =
            updater instanceof Function
              ? updater([
                  {
                    desc: sorting.desc,
                    id: sorting.id,
                  },
                ])
              : updater

          if (!newSortingValue[0]) setSorting({ id: '', desc: false })
          else
            setSorting({
              desc: newSortingValue[0].desc,
              id: newSortingValue[0].id,
            })

          setPagination({ pageIndex: 0 })
        }}
        filters={filters}
        onColumnFiltersChange={setFilters}
      />
    </div>
  )
}

export default EnvironmentsPage
