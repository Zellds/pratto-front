import { useTranslation } from 'react-i18next'
import type { RecipeIngredient } from '../../../types'
import { formatIngredientQuantity, scaleIngredients } from '../ingredientQuantity'
import { OptionalBadge } from './OptionalBadge'
import './IngredientList.css'

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
  const { t, i18n } = useTranslation()
  const scaled = scaleIngredients(ingredients, originalPortions, currentPortions)

  return (
    <div>
      <h2 className="ingredient-list-title">{t('recipes.ingredients_title')}</h2>
      <ul className="ingredient-list">
        {scaled.map((ingredient) => (
          <li key={ingredient.position} className="ingredient-list-item">
            <span className="ingredient-list-name">
              {ingredient.ingredientName}
              {ingredient.isOptional && <OptionalBadge />}
            </span>
            <span className="ingredient-list-quantity">
              {formatIngredientQuantity(ingredient, t, i18n.language)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
