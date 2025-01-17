import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Usuários',
  description: 'Página de consulta de usuários cadastrados no sistema',
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
