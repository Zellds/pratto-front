import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../app/AuthProvider'
import { RecipeCard } from './RecipeCard'
import { getFeed } from './api'
import './FeedSection.css'

export function FeedSection() {
  const { t } = useTranslation()
  const { token } = useAuth()

  const query = useQuery({
    queryKey: ['feed', token],
    queryFn: () => getFeed(undefined, token),
    enabled: !!token,
  })

  return (
    <section className="sec">
      <h2>{t('recipes.feed_title')}</h2>
      {!token && <p>{t('recipes.feed_empty_logged_out')}</p>}
      {token && query.isLoading && <p>{t('recipes.loading')}</p>}
      {token && query.isError && <p role="alert">{t('recipes.error')}</p>}
      {token && query.data && query.data.length === 0 && (
        <p>{t('recipes.feed_empty_no_follows')}</p>
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
