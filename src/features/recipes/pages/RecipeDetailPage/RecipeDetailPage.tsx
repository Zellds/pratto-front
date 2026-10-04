import { useEffect, useRef, useState } from 'react'
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
import { CookMode } from './components/CookMode'
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
  const [isCooking, setIsCooking] = useState(false)
  const [myRating, setMyRating] = useState<number | null>(null)
  const startButtonRef = useRef<HTMLButtonElement>(null)
  const wasCookingRef = useRef(false)

  // Leaving the cooking mode unmounts whatever had focus; hand it back to the
  // button that opened the mode.
  useEffect(() => {
    if (wasCookingRef.current && !isCooking) startButtonRef.current?.focus()
    wasCookingRef.current = isCooking
  }, [isCooking])

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

  if (isCooking && recipe.steps.length > 0) {
    return (
      <CookMode
        recipe={recipe}
        portions={currentPortions}
        onPortionsChange={setPortions}
        onExit={() => setIsCooking(false)}
        myRating={myRating}
        onRated={setMyRating}
      />
    )
  }

  return (
    <div className="recipe-detail-page">
      <RecipeHero title={recipe.title} coverUrl={recipe.coverDisplayUrl} />
      <RecipeMeta
        recipe={recipe}
        isOwner={isOwner}
        onStartCooking={() => setIsCooking(true)}
        startButtonRef={startButtonRef}
      />
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
            <h2>{t('recipes.rate_card_title')}</h2>
            <p>{t('recipes.rate_card_hint')}</p>
            <RatingWidget
              recipeId={recipe.id}
              selectedScore={myRating}
              onRated={setMyRating}
              showPrompt={false}
            />
          </section>
        </div>
      </div>
    </div>
  )
}
