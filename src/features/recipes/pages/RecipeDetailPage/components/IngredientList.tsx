import { useTranslation } from 'react-i18next'
import type { RecipeIngredient } from '../../../types'
import './IngredientList.css'

// eslint-disable-next-line react-refresh/only-export-components -- shared with the cooking mode checklist
export const UNIT_KEY: Record<string, string> = {
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

// eslint-disable-next-line react-refresh/only-export-components -- exported for direct unit testing alongside the component
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

type IngredientListProps = {
  ingredients: RecipeIngredient[]
  originalPortions: number
  currentPortions: number
}

export function IngredientList({
  ingredients,
  originalPortions,
  currentPortions,
}: IngredientListProps) {
  const { t } = useTranslation()
  const scaled = scaleIngredients(ingredients, originalPortions, currentPortions)

  return (
    <div>
      <h3>{t('recipes.ingredients_title')}</h3>
      <ul className="ingredient-list">
        {scaled.map((ingredient) => (
          <li key={ingredient.position} className="ingredient-list-item">
            <span className="ingredient-list-name">
              {ingredient.ingredientName}
              {ingredient.isOptional && (
                <span className="ingredient-list-badge">{t('recipes.optional_badge')}</span>
              )}
            </span>
            <span className="ingredient-list-quantity">
              {ingredient.quantity} {t(UNIT_KEY[ingredient.unit] ?? ingredient.unit)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
