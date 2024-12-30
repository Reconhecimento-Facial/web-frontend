export type UserStatus = 'active' | 'inactive'

export type User = {
  id: number
  name: string
  email: string
  date_of_birth: string
  cpf: string
  phone_number: string
  status: UserStatus
}

export type UserWithEnvironment = User
