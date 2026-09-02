import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/providers/AuthProvider'
import { getRecipe } from '../../api'
import { PortionsControl } from './components/PortionsControl'
import { IngredientList } from './components/IngredientList'
import { StepList } from './components/StepList'
import { RatingWidget } from './components/RatingWidget'
import { Skeleton } from '@/components/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import { apiFetch, ApiError } from '@/api/client'
import './RecipeDetailPage.css'

type MeResponse = {
  username: string
  displayName: string
}

export function RecipeDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const [portions, setPortions] = useState<number | null>(null)

  const query = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipe(id!),
    enabled: !!id,
  })

  const { token } = useAuth()
  const meQuery = useQuery({
    queryKey: ['me', token],
    queryFn: () => apiFetch<MeResponse>('/me', { token }),
    enabled: !!token,
    retry: false,
  })

  if (query.isLoading) {
    return (
      <div className="recipe-detail-page">
        <Skeleton className="recipe-detail-title-skeleton" />
        <Skeleton className="recipe-detail-body-skeleton" />
      </div>
    )
  }

  if (query.isError) {
    const notFound = query.error instanceof ApiError && query.error.status === 404
    return <EmptyState message={notFound ? t('recipes.not_found') : t('recipes.detail_error')} />
  }

  const recipe = query.data!
  const currentPortions = portions ?? recipe.portions
  const isOwner = !!recipe && meQuery.data?.username === recipe.ownerUsername

  return (
    <div className="recipe-detail-page">
      <h1>{recipe.title}</h1>
      {isOwner && (
        <Link to={`/receitas/${recipe.id}/editar`} className="recipe-detail-edit-link">
          {t('recipes.edit_action')}
        </Link>
      )}
      <p className="recipe-detail-description">{recipe.description}</p>

      <div className="recipe-detail-grid">
        <aside className="recipe-detail-sidebar">
          <PortionsControl value={currentPortions} onChange={setPortions} />
          <IngredientList
            ingredients={recipe.ingredients}
            originalPortions={recipe.portions}
            currentPortions={currentPortions}
          />
        </aside>
        <div className="recipe-detail-main">
          <h3>{t('recipes.steps_title')}</h3>
          <StepList steps={recipe.steps} />
          <RatingWidget recipeId={recipe.id} />
        </div>
      </div>
    </div>
  )
}
