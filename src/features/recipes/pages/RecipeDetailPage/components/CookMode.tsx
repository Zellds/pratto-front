import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button'
import { formatDuration } from '@/utils/formatDuration'
import { formatNumber } from '@/utils/formatNumber'
import type { Recipe } from '../../../types'
import { PortionsControl } from './PortionsControl'
import { formatIngredientQuantity, scaleIngredients } from '../ingredientQuantity'
import { OptionalBadge } from './OptionalBadge'
import { RatingStars } from './RatingStars'
import { RatingWidget } from './RatingWidget'
import './StepsSheet.css'
import './CookMode.css'

type CookModeProps = {
  recipe: Recipe
  portions: number
  onPortionsChange: (next: number) => void
  onExit: () => void
  myRating?: number | null
  onRated?: (score: number) => void
}

export function CookMode({
  recipe,
  portions,
  onPortionsChange,
  onExit,
  myRating,
  onRated,
}: CookModeProps) {
  const { t, i18n } = useTranslation()
  const steps = [...recipe.steps].sort((a, b) => a.position - b.position)
  const ingredients = scaleIngredients(recipe.ingredients, recipe.portions, portions)
  const [requestedStepIndex, setStepIndex] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [gathered, setGathered] = useState<Set<number>>(new Set())

  const titleRef = useRef<HTMLHeadingElement>(null)
  const finishHeadingRef = useRef<HTMLHeadingElement>(null)

  // Entering the mode swaps the whole page body; keep keyboard and
  // screen-reader users at the top of the new content.
  useEffect(() => {
    window.scrollTo(0, 0)
    titleRef.current?.focus()
  }, [])

  // The step controls unmount when the cook finishes, which would drop focus
  // to <body>; land keyboard and screen-reader users on the new content.
  useEffect(() => {
    if (isFinished) finishHeadingRef.current?.focus()
  }, [isFinished])

  if (steps.length === 0) return null

  // The recipe can be refetched with fewer steps while cooking.
  const stepIndex = Math.min(requestedStepIndex, steps.length - 1)
  const isLastStep = stepIndex === steps.length - 1

  function toggleGathered(position: number) {
    setGathered((current) => {
      const next = new Set(current)
      if (!next.delete(position)) next.add(position)
      return next
    })
  }

  function handleNext() {
    if (isLastStep) setIsFinished(true)
    else setStepIndex(stepIndex + 1)
  }

  return (
    <div className="cook-mode">
      <header className="cook-mode-header">
        <div>
          <h1 ref={titleRef} tabIndex={-1}>
            {recipe.title}
          </h1>
          <p className="cook-mode-support">
            {recipe.ownerDisplayName && <span>{recipe.ownerDisplayName}</span>}
            <span>{formatDuration(recipe.prepTimeMinutes, t)}</span>
            {recipe.averageRating !== null && (
              <span className="cook-mode-support-rating">
                <RatingStars value={recipe.averageRating} />
                {formatNumber(recipe.averageRating, i18n.language, 1)}
              </span>
            )}
          </p>
        </div>
        <Button variant="secondary" onClick={onExit}>
          {t('recipes.cook_exit_action')}
        </Button>
      </header>

      <div className="cook-mode-grid">
        <aside className="cook-mode-ingredients">
          <PortionsControl value={portions} onChange={onPortionsChange} />
          <h2 className="cook-mode-ingredients-title">{t('recipes.ingredients_title')}</h2>
          <ul className="cook-mode-ingredient-list">
            {ingredients.map((ingredient) => (
              <li key={ingredient.position}>
                <label className="cook-mode-ingredient">
                  <input
                    type="checkbox"
                    checked={gathered.has(ingredient.position)}
                    onChange={() => toggleGathered(ingredient.position)}
                  />
                  <span className="cook-mode-ingredient-name">
                    {ingredient.ingredientName}
                    {ingredient.isOptional && <OptionalBadge />}
                  </span>
                  <span className="cook-mode-ingredient-quantity">
                    {formatIngredientQuantity(ingredient, t, i18n.language)}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <p className="cook-mode-ingredients-progress">
            {t('recipes.cook_ingredients_progress', {
              done: gathered.size,
              total: ingredients.length,
            })}
          </p>
        </aside>

        {isFinished ? (
          <section className="cook-mode-finish">
            <h2 ref={finishHeadingRef} tabIndex={-1}>
              {t('recipes.cook_done_title')}
            </h2>
            <p>{t('recipes.cook_done_hint')}</p>
            <RatingWidget
              recipeId={recipe.id}
              selectedScore={myRating}
              onRated={onRated}
              showPrompt={false}
            />
            <Button onClick={onExit}>{t('recipes.cook_back_to_recipe_action')}</Button>
          </section>
        ) : (
          <div className="cook-mode-steps">
            <section className="steps-sheet cook-mode-sheet">
              <span className="steps-sheet-tape" aria-hidden="true" />
              <div aria-live="polite" aria-atomic="true">
                <p className="cook-mode-step-label">
                  {t('recipes.cook_step_progress', { current: stepIndex + 1, total: steps.length })}
                </p>
                <p className="cook-mode-step-text">{steps[stepIndex].instruction}</p>
              </div>
            </section>
            <div className="cook-mode-controls">
              <Button
                variant="secondary"
                className="cook-mode-previous"
                onClick={() => setStepIndex(stepIndex - 1)}
                disabled={stepIndex === 0}
              >
                {t('recipes.cook_previous_action')}
              </Button>
              <div className="cook-mode-progress">
                {steps.map((step, index) => (
                  <button
                    key={step.position}
                    type="button"
                    className={
                      index <= stepIndex
                        ? 'cook-mode-progress-segment cook-mode-progress-segment-done'
                        : 'cook-mode-progress-segment'
                    }
                    aria-label={t('recipes.cook_go_to_step', { step: index + 1 })}
                    aria-current={index === stepIndex ? 'step' : undefined}
                    tabIndex={-1}
                    onClick={() => setStepIndex(index)}
                  />
                ))}
              </div>
              <Button className="cook-mode-next" onClick={handleNext}>
                {isLastStep ? t('recipes.cook_finish_action') : t('recipes.cook_next_action')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
