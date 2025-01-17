import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Ambientes',
  description: 'Página de consulta de ambientes cadastrados no sistema',
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
