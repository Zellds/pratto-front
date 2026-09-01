import { apiFetch } from '../../shared/api/client'
import type { Recipe, SearchRecipesParams } from './types'

export function searchRecipes(params: SearchRecipesParams): Promise<Recipe[]> {
  const query = new URLSearchParams()
  if (params.q) query.set('q', params.q)
  if (params.page) query.set('page', String(params.page))

  const queryString = query.toString()
  return apiFetch<Recipe[]>(`/recipes${queryString ? `?${queryString}` : ''}`)
}

export function getFeed(page?: number, token?: string | null): Promise<Recipe[]> {
  const query = new URLSearchParams()
  if (page) query.set('page', String(page))

  const queryString = query.toString()
  return apiFetch<Recipe[]>(`/feed${queryString ? `?${queryString}` : ''}`, { token })
}
