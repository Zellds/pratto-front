import { useTranslation } from 'react-i18next'
import { RecipeCard } from './RecipeCard'
import type { Recipe } from './types'
import './DiscoverSection.css'

export function DiscoverSection({ recipes }: { recipes: Recipe[] }) {
  const { t } = useTranslation()

  return (
    <section className="sec">
      <div className="section-head">
        <h2>{t('recipes.discover_title')}</h2>
        {/* Personalização/tendências ainda não existem no backend — abas presentes, mas desabilitadas. */}
        <div className="section-tabs">
          <button className="section-tab active" disabled>
            {t('recipes.tab_for_you')}
          </button>
          <button className="section-tab" disabled>
            {t('recipes.tab_trending')}
          </button>
          <button className="section-tab" disabled>
            {t('recipes.tab_surprise')}
          </button>
        </div>
        <button className="link" disabled title={t('recipes.discover_refresh_disabled_hint')}>
          {t('recipes.discover_refresh')}
        </button>
      </div>
      <ul className="discover-grid">
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            {/*
              O selo real seria "Você tem X dos Y ingredientes" (match com a
              Despensa) — essa é uma feature própria e futura (precisa de
              cálculo Despensa×Receita, ainda não construído). Por enquanto
              o selo fica visível e claramente desabilitado, sem fingir
              calcular nada.
            */}
            <span className="discover-badge">{t('recipes.discover_badge_soon')}</span>
            <RecipeCard recipe={recipe} />
          </li>
        ))}
      </ul>
    </section>
  )
}
