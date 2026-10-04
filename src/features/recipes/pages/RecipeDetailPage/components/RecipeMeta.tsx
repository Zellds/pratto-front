import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button'
import { initials } from '@/utils/initials'
import { formatDuration } from '@/utils/formatDuration'
import type { Recipe } from '../../../types'
import { RatingStars } from './RatingStars'
import './RecipeMeta.css'

type RecipeMetaProps = {
  recipe: Recipe
  isOwner: boolean
  onStartCooking: () => void
}

export function RecipeMeta({ recipe, isOwner, onStartCooking }: RecipeMetaProps) {
  const { t } = useTranslation()

  return (
    <div className="recipe-meta">
      {recipe.ownerDisplayName && (
        <div className="recipe-meta-author">
          <span className="recipe-meta-avatar" aria-hidden="true">
            {initials(recipe.ownerDisplayName)}
          </span>
          <span className="recipe-meta-author-name">
            <strong>{recipe.ownerDisplayName}</strong>
            {recipe.ownerUsername && (
              <span className="recipe-meta-username">@{recipe.ownerUsername}</span>
            )}
          </span>
        </div>
      )}
      <div className="recipe-meta-actions">
        <span className="recipe-meta-pill">
          {recipe.averageRating === null ? (
            <span className="recipe-meta-pill-soft">{t('recipes.no_ratings')}</span>
          ) : (
            <>
              <RatingStars value={recipe.averageRating} />
              <span>{recipe.averageRating.toFixed(1)}</span>
              <span className="recipe-meta-pill-soft">
                {t('recipes.ratings_count', { count: recipe.ratingsCount })}
              </span>
            </>
          )}
        </span>
        <span className="recipe-meta-pill">{formatDuration(recipe.prepTimeMinutes, t)}</span>
        {isOwner && (
          <Link to={`/receitas/${recipe.id}/editar`} className="button button-secondary">
            {t('recipes.edit_action')}
          </Link>
        )}
        {recipe.steps.length > 0 && (
          <Button onClick={onStartCooking}>{t('recipes.start_cooking_action')}</Button>
        )}
      </div>
    </div>
  )
}
