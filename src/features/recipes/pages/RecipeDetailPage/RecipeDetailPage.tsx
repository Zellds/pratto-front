import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/providers/AuthProvider'
import { getRecipe } from '../../api'
import { PortionsControl } from './components/PortionsControl'
import { IngredientList } from './components/IngredientList'
import { RecipeHero } from './components/RecipeHero'
import { RecipeMeta } from './components/RecipeMeta'
import { StepsSheet } from './components/StepsSheet'
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
  // Read in Task 3 (cooking mode); for now the start button only flips it.
  const [, setIsCooking] = useState(false)

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
        <Skeleton className="recipe-detail-cover-skeleton" />
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
      <RecipeHero title={recipe.title} coverUrl={recipe.coverDisplayUrl} />
      <RecipeMeta recipe={recipe} isOwner={isOwner} onStartCooking={() => setIsCooking(true)} />
      <p className="recipe-detail-description">{recipe.description}</p>

      <div className="recipe-detail-grid">
        <aside className="recipe-detail-ingredients">
          <PortionsControl value={currentPortions} onChange={setPortions} />
          <IngredientList
            ingredients={recipe.ingredients}
            originalPortions={recipe.portions}
            currentPortions={currentPortions}
          />
        </aside>
        <div className="recipe-detail-main">
          <StepsSheet steps={recipe.steps} />
          <section className="recipe-detail-rating">
            <h3>{t('recipes.rate_card_title')}</h3>
            <p>{t('recipes.rate_card_hint')}</p>
            <RatingWidget recipeId={recipe.id} />
          </section>
        </div>
      </div>
    </div>
  )
}
