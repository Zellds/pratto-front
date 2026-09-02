import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button'
import { initials } from '@/utils/initials'
import type { Recipe } from '../../../types'
import './Hero.css'

export function Hero({ recipe }: { recipe: Recipe }) {
  const { t } = useTranslation()

  return (
    <section className="hero sec">
      {recipe.coverDisplayUrl ? (
        <img className="hero-photo" src={recipe.coverDisplayUrl} alt={recipe.title} />
      ) : (
        <div className="hero-photo-placeholder" aria-hidden="true" />
      )}
      <div className="hero-body">
        <span className="hero-tag">{t('recipes.hero_tag')}</span>
        <h2>{recipe.title}</h2>
        <p>{recipe.description}</p>
        {recipe.ownerDisplayName && (
          <div className="hero-by">
            <span className="hero-by-avatar" aria-hidden="true">
              {initials(recipe.ownerDisplayName)}
            </span>
            <span>{t('recipes.by_author', { name: recipe.ownerDisplayName })}</span>
          </div>
        )}
        <div className="hero-meta">
          <span>{t('recipes.prep_time', { minutes: recipe.prepTimeMinutes })}</span>
          <span>{t('recipes.portions', { count: recipe.portions })}</span>
          <span className="hero-rating">
            {recipe.averageRating !== null
              ? t('recipes.average_rating', { rating: recipe.averageRating })
              : t('recipes.no_ratings')}
          </span>
        </div>
        <div className="hero-actions">
          <Link to={`/receitas/${recipe.id}`} className="button button-primary">
            {t('recipes.hero_view')}
          </Link>
          {/* Salvos/favoritos não existe como feature ainda — botão fica desabilitado, não escondido */}
          <Button variant="secondary" disabled title={t('recipes.saved_disabled_hint')}>
            {t('recipes.hero_save')}
          </Button>
        </div>
      </div>
    </section>
  )
}
