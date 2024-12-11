import { CredentialsSignin } from 'next-auth'

export class InvalidCredentials extends CredentialsSignin {
  code = 'invalid-credentials'
}
