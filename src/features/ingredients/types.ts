export type IngredientStatus = 'provisional' | 'approved' | 'rejected'

export type Ingredient = {
  id: string
  name: string
  status: IngredientStatus
}
