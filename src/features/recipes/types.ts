export type RecipeIngredient = {
  ingredientId: string
  quantity: number
  unit: string
  position: number
}

export type RecipeStep = {
  position: number
  instruction: string
}

export type RecipeStatus = 'draft' | 'pending_review' | 'published' | 'rejected'

export type Recipe = {
  id: string
  ownerId: string
  title: string
  description: string
  portions: number
  prepTimeMinutes: number
  status: RecipeStatus
  coverMediaId: string | null
  rejectionReason: string | null
  averageRating: number | null
  ratingsCount: number
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
}

export type SearchRecipesParams = {
  q?: string
  page?: number
}
