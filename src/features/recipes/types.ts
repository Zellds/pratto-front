export type RecipeIngredient = {
  ingredientId: string
  ingredientName: string | null
  quantity: number
  unit: string
  position: number
  isOptional: boolean
}

export type RecipeStep = {
  position: number
  instruction: string
}

export type RecipeStatus = 'draft' | 'pending_review' | 'published' | 'rejected'

export type Recipe = {
  id: string
  ownerId: string
  ownerUsername: string | null
  ownerDisplayName: string | null
  title: string
  description: string
  portions: number
  prepTimeMinutes: number
  status: RecipeStatus
  coverMediaId: string | null
  coverThumbnailUrl: string | null
  coverDisplayUrl: string | null
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

export type MeasurementUnit =
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'unidade'
  | 'xicara'
  | 'colher_sopa'
  | 'colher_cha'
  | 'pitada'
  | 'a_gosto'

export type RecipeIngredientPayload = {
  ingredient_id?: string
  ingredient_name?: string
  quantity: number
  unit: MeasurementUnit
  position: number
  is_optional?: boolean
}

export type RecipeStepPayload = {
  position: number
  instruction: string
}

export type RecipePayload = {
  title: string
  description: string
  portions: number
  prep_time_minutes: number
  ingredients: RecipeIngredientPayload[]
  steps: RecipeStepPayload[]
}

export type Rating = {
  id: string
  recipeId: string
  userId: string
  score: number
}
