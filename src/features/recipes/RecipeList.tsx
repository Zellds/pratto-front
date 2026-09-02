import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'
import { RecipeCard } from './RecipeCard'
import { RecipeCardSkeleton } from './RecipeCardSkeleton'
import { searchRecipes } from './api'
import { EmptyState } from '@/components/EmptyState'
import './RecipeList.css'

const SKELETON_COUNT = 8

type RecipeListProps = {
  showSearch?: boolean
  showPagination?: boolean
}

export function RecipeList({ showSearch = false, showPagination = false }: RecipeListProps) {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const [searchInput, setSearchInput] = useState(initialQuery)
  const [debouncedSearch, setDebouncedSearch] = useState(initialQuery)
  const [page, setPage] = useState(1)
  const [previousDebouncedSearch, setPreviousDebouncedSearch] = useState(debouncedSearch)

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchInput), 300)
    return () => clearTimeout(timeout)
  }, [searchInput])

  if (debouncedSearch !== previousDebouncedSearch) {
    setPreviousDebouncedSearch(debouncedSearch)
    setPage(1)
  }

  const query = useQuery({
    queryKey: ['recipes', { q: debouncedSearch, page }],
    queryFn: () => searchRecipes({ q: debouncedSearch || undefined, page }),
  })

  return (
    <div>
      {showSearch && (
        <input
          aria-label={t('recipes.search_label')}
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
      )}
      {query.isLoading && (
        <ul className="recipe-grid">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <li key={index}>
              <RecipeCardSkeleton />
            </li>
          ))}
        </ul>
      )}
      {query.isError && <p role="alert">{t('recipes.error')}</p>}
      {query.data && query.data.length === 0 && (
        <EmptyState
          message={t('recipes.empty')}
          action={
            debouncedSearch ? (
              <button
                onClick={() => setSearchInput('')}
                className="button button-secondary"
                type="button"
              >
                {t('recipes.clear_search_action')}
              </button>
            ) : (
              <Link to="/nova-receita" className="button button-primary">
                {t('recipes.new_recipe_action')}
              </Link>
            )
          }
        />
      )}
      {query.data && query.data.length > 0 && (
        <ul className="recipe-grid">
          {query.data.map((recipe) => (
            <li key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </li>
          ))}
        </ul>
      )}
      {showPagination && (
        <div>
          <button
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
          >
            {t('recipes.previous_page')}
          </button>
          <button
            onClick={() => setPage((current) => current + 1)}
            disabled={!!query.data && query.data.length < 20}
          >
            {t('recipes.next_page')}
          </button>
        </div>
      )}
    </div>
  )
}
