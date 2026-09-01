import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '../../shared/ui/Button'
import type { Recipe } from './types'
import './Hero.css'

export function Hero({ recipe }: { recipe: Recipe }) {
  const { t } = useTranslation()

  return (
    <section className="hero">
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
          <p>{t('recipes.by_author', { name: recipe.ownerDisplayName })}</p>
        )}
        <div>
          <Link to={`/receitas/${recipe.id}`}>{t('recipes.hero_view')}</Link>
          {/* Salvos/favoritos não existe como feature ainda — botão fica desabilitado, não escondido */}
          <Button variant="secondary" disabled title={t('recipes.saved_disabled_hint')}>
            {t('recipes.hero_save')}
          </Button>
        </div>
      </div>
    </section>
  )
}
