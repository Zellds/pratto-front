import { apiFetch } from '@/api/client'
import type { Ingredient } from '../types'

export function searchIngredients(q: string): Promise<Ingredient[]> {
  const query = new URLSearchParams({ q })
  return apiFetch<Ingredient[]>(`/ingredients?${query.toString()}`)
}
