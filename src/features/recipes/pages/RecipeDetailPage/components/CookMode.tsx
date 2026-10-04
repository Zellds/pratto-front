import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button'
import { formatDuration } from '@/utils/formatDuration'
import type { Recipe } from '../../../types'
import { PortionsControl } from './PortionsControl'
import { UNIT_KEY, scaleIngredients } from './IngredientList'
import { RatingStars } from './RatingStars'
import { RatingWidget } from './RatingWidget'
import './StepsSheet.css'
import './CookMode.css'

type CookModeProps = {
  recipe: Recipe
  portions: number
  onPortionsChange: (next: number) => void
  onExit: () => void
}

export function CookMode({ recipe, portions, onPortionsChange, onExit }: CookModeProps) {
  const { t } = useTranslation()
  const steps = [...recipe.steps].sort((a, b) => a.position - b.position)
  const ingredients = scaleIngredients(recipe.ingredients, recipe.portions, portions)
  const [stepIndex, setStepIndex] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [gathered, setGathered] = useState<Set<number>>(new Set())

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
          <h1>{recipe.title}</h1>
          <p className="cook-mode-support">
            {recipe.ownerDisplayName && <span>{recipe.ownerDisplayName}</span>}
            <span>{formatDuration(recipe.prepTimeMinutes, t)}</span>
            {recipe.averageRating !== null && (
              <span className="cook-mode-support-rating">
                <RatingStars value={recipe.averageRating} />
                {recipe.averageRating.toFixed(1)}
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
          <h3>{t('recipes.ingredients_title')}</h3>
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
                    {ingredient.isOptional && (
                      <span className="cook-mode-ingredient-badge">
                        {t('recipes.optional_badge')}
                      </span>
                    )}
                  </span>
                  <span className="cook-mode-ingredient-quantity">
                    {ingredient.quantity} {t(UNIT_KEY[ingredient.unit] ?? ingredient.unit)}
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
            <h2>{t('recipes.cook_done_title')}</h2>
            <p>{t('recipes.cook_done_hint')}</p>
            <RatingWidget recipeId={recipe.id} />
            <Button onClick={onExit}>{t('recipes.cook_back_to_recipe_action')}</Button>
          </section>
        ) : (
          <div className="cook-mode-steps">
            <section className="steps-sheet cook-mode-sheet">
              <span className="steps-sheet-tape" aria-hidden="true" />
              <p className="cook-mode-step-label" aria-live="polite">
                {t('recipes.cook_step_progress', { current: stepIndex + 1, total: steps.length })}
              </p>
              <p className="cook-mode-step-text">{steps[stepIndex].instruction}</p>
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
