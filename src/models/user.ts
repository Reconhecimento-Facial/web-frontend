export type UserStatus = 'active' | 'inactive'

export type User = {
  id: number
  name: string
  email: string
  date_of_birth: string
  cpf: string
  phone_number: string
  photo_url: string
  status: UserStatus
}

export type UserWithLastAccess = User & {
  last_access_time?: string
  last_accessed_environment_id?: number
  last_accessed_environment_name?: string
}

export type UserWithEnvironment = User
