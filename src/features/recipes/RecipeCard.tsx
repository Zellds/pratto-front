import { useTranslation } from 'react-i18next'
import { Card } from '../../shared/ui/Card'
import { SavedIcon } from '../../shared/ui/icons'
import type { Recipe } from './types'
import './RecipeCard.css'

export function RecipeCard({ recipe, rank }: { recipe: Recipe; rank?: number }) {
  const { t } = useTranslation()

  return (
    <Card>
      <div className="recipe-card-photo-wrap">
        {recipe.coverThumbnailUrl ? (
          <img className="recipe-card-photo" src={recipe.coverThumbnailUrl} alt={recipe.title} />
        ) : (
          <div className="recipe-card-photo-placeholder" aria-hidden="true" />
        )}
        {rank !== undefined && (
          <>
            <span className="recipe-card-rank">#{rank}</span>
            <button
              className="recipe-card-save"
              disabled
              aria-label={t('recipes.hero_save')}
              title={t('recipes.saved_disabled_hint')}
            >
              <SavedIcon size={15} />
            </button>
          </>
        )}
      </div>
      <div className="card-body">
        <h3>{recipe.title}</h3>
        {recipe.ownerDisplayName && (
          <p className="recipe-card-author">
            {t('recipes.by_author', { name: recipe.ownerDisplayName })}
          </p>
        )}
        {recipe.status === 'pending_review' && (
          <span className="pill">{t('recipes.pending_review_badge')}</span>
        )}
        <div className="recipe-card-meta">
          <span>{t('recipes.prep_time', { minutes: recipe.prepTimeMinutes })}</span>
          <span className="recipe-card-rating">
            {recipe.averageRating !== null
              ? t('recipes.average_rating', { rating: recipe.averageRating })
              : t('recipes.no_ratings')}
          </span>
        </div>
      </div>
    </Card>
  )
}
