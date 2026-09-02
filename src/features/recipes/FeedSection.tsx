import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/providers/AuthProvider'
import { EmptyState } from '@/components/EmptyState'
import { RecipeCard } from './RecipeCard'
import { RecipeCardSkeleton } from './RecipeCardSkeleton'
import { getFeed } from './api'
import './FeedSection.css'

export function FeedSection() {
  const { t } = useTranslation()
  const { token, openAuthModal } = useAuth()

  const query = useQuery({
    queryKey: ['feed', token],
    queryFn: () => getFeed(undefined, token),
    enabled: !!token,
  })

  return (
    <section className="sec">
      <h2>{t('recipes.feed_title')}</h2>
      {!token && (
        <EmptyState
          message={t('recipes.feed_empty_logged_out')}
          action={
            <button onClick={openAuthModal} className="button button-primary">
              {t('common.log_in')}
            </button>
          }
        />
      )}
      {token && query.isLoading && (
        <ul className="feed-list">
          {[1, 2].map((n) => (
            <li key={n}>
              <RecipeCardSkeleton />
            </li>
          ))}
        </ul>
      )}
      {token && query.isError && <p role="alert">{t('recipes.error')}</p>}
      {token && query.data && query.data.length === 0 && (
        <EmptyState
          message={t('recipes.feed_empty_no_follows')}
          action={
            <Link to="/receitas" className="button button-secondary">
              {t('recipes.explore_action')}
            </Link>
          }
        />
      )}
      {token && query.data && query.data.length > 0 && (
        <ul className="feed-list">
          {query.data.map((recipe) => (
            <li key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
