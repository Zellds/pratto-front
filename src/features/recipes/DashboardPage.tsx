import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { searchRecipes } from './api'
import { Hero } from './Hero'
import { RecipeCard } from './RecipeCard'
import { DiscoverSection } from './DiscoverSection'
import { ChefsSection } from './ChefsSection'
import { FeedSection } from './FeedSection'
import type { Recipe } from './types'
import './DashboardPage.css'

function byRatingDesc(a: Recipe, b: Recipe): number {
  if (a.averageRating === b.averageRating) return b.ratingsCount - a.ratingsCount
  if (a.averageRating === null) return 1
  if (b.averageRating === null) return -1
  return b.averageRating - a.averageRating
}

export function DashboardPage() {
  const { t } = useTranslation()

  const query = useQuery({
    queryKey: ['recipes', { q: undefined, page: 1 }],
    queryFn: () => searchRecipes({ page: 1 }),
  })

  const sorted = query.data ? [...query.data].sort(byRatingDesc) : []
  const hero = sorted[0]
  const popular = sorted.slice(1, 4)
  const discoverable = sorted.slice(4, 8)

  return (
    <div>
      <h1 className="sr-only">{t('recipes.dashboard_page_title')}</h1>

      {query.isLoading && <p>{t('recipes.loading')}</p>}
      {query.isError && <p role="alert">{t('recipes.error')}</p>}
      {query.data && query.data.length === 0 && <p>{t('recipes.empty')}</p>}

      {hero && <Hero recipe={hero} />}

      {popular.length > 0 && (
        <section>
          <h2>{t('recipes.dashboard_title')}</h2>
          <ul className="recipe-grid">
            {popular.map((recipe) => (
              <li key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </li>
            ))}
          </ul>
          <Link to="/receitas">{t('recipes.view_all')}</Link>
        </section>
      )}

      {discoverable.length > 0 && <DiscoverSection recipes={discoverable} />}

      <ChefsSection />
      <FeedSection />
    </div>
  )
}
