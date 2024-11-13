import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { useCallback } from 'react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  setPageIndex: (pageIndex: number) => void
  pageIndex: number
  totalPages: number
  className?: string
}

export function Pagination({
  setPageIndex,
  pageIndex,
  totalPages,
  className,
}: PaginationProps) {
  const canPreviousPage = pageIndex > 0
  const canNextPage = pageIndex < totalPages - 1

  const previousPage = useCallback(
    () => setPageIndex(pageIndex - 1),
    [pageIndex, setPageIndex],
  )

  const nextPage = useCallback(
    () => setPageIndex(pageIndex + 1),
    [pageIndex, setPageIndex],
  )

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="flex w-[100px] items-center justify-center text-sm font-medium">
        Página {pageIndex + 1} de {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => setPageIndex(0)}
          disabled={!canPreviousPage}
        >
          <span className="sr-only">Go to first page</span>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={previousPage}
          disabled={!canPreviousPage}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={nextPage}
          disabled={!canNextPage}
        >
          <span className="sr-only">Próxima página</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => setPageIndex(totalPages - 1)}
          disabled={!canNextPage}
        >
          <span className="sr-only">Go to last page</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
