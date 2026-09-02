import { apiFetch } from '@/api/client'
import type { Recipe, SearchRecipesParams, RecipePayload, Rating } from '../types'

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

export function getRecipe(id: string, portions?: number, token?: string | null): Promise<Recipe> {
  const query = new URLSearchParams()
  if (portions) query.set('portions', String(portions))

  const queryString = query.toString()
  return apiFetch<Recipe>(`/recipes/${id}${queryString ? `?${queryString}` : ''}`, { token })
}

export function createRecipe(payload: RecipePayload, token: string): Promise<Recipe> {
  return apiFetch<Recipe>('/recipes', { method: 'POST', token, body: payload })
}

export function updateRecipe(id: string, payload: RecipePayload, token: string): Promise<Recipe> {
  return apiFetch<Recipe>(`/recipes/${id}`, { method: 'PATCH', token, body: payload })
}

export function publishRecipe(id: string, token: string): Promise<Recipe> {
  return apiFetch<Recipe>(`/recipes/${id}/publish`, { method: 'POST', token })
}

export function rateRecipe(id: string, score: number, token: string): Promise<Rating> {
  return apiFetch<Rating>(`/recipes/${id}/rating`, { method: 'PUT', token, body: { score } })
}
