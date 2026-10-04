import type { TFunction } from 'i18next'
import { formatNumber } from '@/utils/formatNumber'
import type { RecipeIngredient } from '../../types'

const UNIT_KEY: Record<string, string> = {
  g: 'recipes.unit_g',
  kg: 'recipes.unit_kg',
  ml: 'recipes.unit_ml',
  l: 'recipes.unit_l',
  unidade: 'recipes.unit_unidade',
  xicara: 'recipes.unit_xicara',
  colher_sopa: 'recipes.unit_colher_sopa',
  colher_cha: 'recipes.unit_colher_cha',
  pitada: 'recipes.unit_pitada',
  a_gosto: 'recipes.unit_a_gosto',
}

export function scaleIngredients(
  ingredients: RecipeIngredient[],
  originalPortions: number,
  targetPortions: number,
): RecipeIngredient[] {
  if (targetPortions === originalPortions) return ingredients

  const ratio = targetPortions / originalPortions

  return ingredients.map((ingredient) => ({
    ...ingredient,
    quantity: Math.round(ingredient.quantity * ratio * 100) / 100,
  }))
}

export function formatIngredientQuantity(
  ingredient: RecipeIngredient,
  t: TFunction,
  language: string,
): string {
  const unit = t(UNIT_KEY[ingredient.unit] ?? ingredient.unit)
  return `${formatNumber(ingredient.quantity, language, 2)} ${unit}`
}
