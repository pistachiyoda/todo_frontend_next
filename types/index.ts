export type AuthForm = {
  email: string
  password: string
}

export type Edited = {
  id: number
  title: string
  description?: string | null
}
