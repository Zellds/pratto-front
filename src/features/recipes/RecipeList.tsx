import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { RecipeCard } from './RecipeCard'
import { searchRecipes } from './api'

type RecipeListProps = {
  showSearch?: boolean
  showPagination?: boolean
}

export function RecipeList({ showSearch = false, showPagination = false }: RecipeListProps) {
  const { t } = useTranslation()
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
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
      {query.isLoading && <p>{t('recipes.loading')}</p>}
      {query.isError && <p role="alert">{t('recipes.error')}</p>}
      {query.data && query.data.length === 0 && <p>{t('recipes.empty')}</p>}
      {query.data && query.data.length > 0 && (
        <ul>
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
          <button onClick={() => setPage((current) => current + 1)}>
            {t('recipes.next_page')}
          </button>
        </div>
      )}
    </div>
  )
}
