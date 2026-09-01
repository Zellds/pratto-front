import { useTranslation } from 'react-i18next'
import { RecipeCard } from './RecipeCard'
import type { Recipe } from './types'
import './DiscoverSection.css'

export function DiscoverSection({ recipes }: { recipes: Recipe[] }) {
  const { t } = useTranslation()

  return (
    <section>
      <h2>{t('recipes.discover_title')}</h2>
      <ul className="recipe-grid">
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
