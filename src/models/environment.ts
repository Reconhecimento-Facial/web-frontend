export type Environment = {
  id: number
  name: string
  photo_url: string
  created_at: string
  updated_at: string
  creator_admin_id: number
}

export type EnvironmentWithLastAccess = Environment & {
  last_access_time?: string
  last_accessed_by_user_id?: number
  last_accessed_by_user_name?: string
}

export type EnvironmentHistory = {
  user: {
    id: number
    name: string
  }
  accessAt: Date
  allowed: boolean
}
