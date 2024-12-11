import { CredentialsSignin } from 'next-auth'

export class ServerError extends CredentialsSignin {
  code = 'server-error'
}
