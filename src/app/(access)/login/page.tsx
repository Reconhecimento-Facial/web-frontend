import { NextPage } from 'next'
import { LoginForm } from './components/login-form'
import { CardHeader, CardTitle } from '@/components/ui/card'

const LoginPage: NextPage = () => {
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
