import { apiFetch } from '@/api/client'
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types'

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/login', { method: 'POST', body: payload })
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/register', { method: 'POST', body: payload })
}
