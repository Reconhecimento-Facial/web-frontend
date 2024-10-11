import { Card } from '@/components/ui/card'
import { ReactNode } from 'react'

export default function AccessLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full items-stretch justify-stretch">
      <Card className="xs:shadow-none m-auto w-full max-sm:h-full max-sm:border-none sm:max-w-md">
        {children}
      </Card>
    </div>
  )
}
