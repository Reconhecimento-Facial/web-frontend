import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NextPage } from 'next'
import { RecoveryForm } from './_components/recovery-form'

const AccountRecoveryPage: NextPage = () => {
  return (
    <>
      <CardHeader className="mx-auto max-w-md space-y-8 sm:max-w-full">
        <CardTitle className="text-center">Recuperação da Conta</CardTitle>
        <CardDescription>
          Insira o email cadastrado para receber um código de redefinição da sua
          senha
        </CardDescription>
      </CardHeader>

      <RecoveryForm />
    </>
  )
}

export default AccountRecoveryPage
