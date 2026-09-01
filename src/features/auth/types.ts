export type LoginPayload = {
  username: string
  password: string
}

export type RegisterPayload = {
  username: string
  display_name: string
  password: string
}

export type AuthResponse = {
  token: string
}
