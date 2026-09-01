import { useTranslation } from 'react-i18next'
import { Card } from '../../shared/ui/Card'
import type { Recipe } from './types'
import './RecipeCard.css'

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { t } = useTranslation()

  return (
    <Card>
      {recipe.coverThumbnailUrl ? (
        <img className="recipe-card-photo" src={recipe.coverThumbnailUrl} alt={recipe.title} />
      ) : (
        <div className="recipe-card-photo-placeholder" aria-hidden="true" />
      )}
      <h3>{recipe.title}</h3>
      {recipe.ownerDisplayName && (
        <p>{t('recipes.by_author', { name: recipe.ownerDisplayName })}</p>
      )}
      {recipe.status === 'pending_review' && <span>{t('recipes.pending_review_badge')}</span>}
      <p>{t('recipes.prep_time', { minutes: recipe.prepTimeMinutes })}</p>
      <p>
        {recipe.averageRating !== null
          ? t('recipes.average_rating', { rating: recipe.averageRating })
          : t('recipes.no_ratings')}
      </p>
    </Card>
  )
}
