'use client'

import { usePathname } from 'next/navigation'
import { AppUserMenu } from './app-user-menu'
import { Separator } from './ui/separator'
import { SidebarTrigger, useSidebar } from './ui/sidebar'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { breadcrumbs } from '@/app/breadcrumbs'
import { Fragment } from 'react'

export function AppTopbar() {
  const pathname = usePathname()
  const { isMobile } = useSidebar()

  const paths = pathname.split('/').filter(Boolean) as Array<
    keyof typeof breadcrumbs
  >
  const currentPage = paths
    .splice(paths.length - 1, 1)
    .join() as keyof typeof breadcrumbs

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        {currentPage && !isMobile && (
          <>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Início</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                {paths.map((p, index) => (
                  <Fragment key={p}>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink
                        href={paths.slice(0, index + 1).join('/')}
                        aria-label={`Ir para ${breadcrumbs[p] || p}`}
                      >
                        {breadcrumbs[p] || p}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </Fragment>
                ))}

                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {breadcrumbs[currentPage] || currentPage}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 px-4">
        <AppUserMenu />
      </div>
    </header>
  )
}
