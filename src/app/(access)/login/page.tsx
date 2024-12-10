import { NextPage } from 'next'
import { LoginForm } from './_components/login-form'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

const LoginPage: NextPage = async () => {
  const session = await auth()

  if (session?.user) {
    redirect('/users')
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-center">Login</CardTitle>
      </CardHeader>

      <LoginForm />
    </>
  )
}

export default LoginPage
