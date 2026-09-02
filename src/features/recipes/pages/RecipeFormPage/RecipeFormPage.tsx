import { useState, useId, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@/components/Button'
import { ApiError } from '@/api/client'
import { getRecipe, createRecipe, updateRecipe, publishRecipe } from '../../api'
import type { RecipePayload, MeasurementUnit } from '../../types'
import { IngredientRow, type IngredientRowValue } from './components/IngredientRow'
import { StepRow } from './components/StepRow'
import './RecipeFormPage.css'

function emptyIngredient(): IngredientRowValue {
  return { name: '', quantity: '', unit: 'unidade' }
}

export function RecipeFormPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = useAuth()
  const isEditing = !!id
  const formId = useId()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [portions, setPortions] = useState('4')
  const [prepTimeMinutes, setPrepTimeMinutes] = useState('30')
  const [ingredients, setIngredients] = useState<IngredientRowValue[]>([emptyIngredient()])
  const [steps, setSteps] = useState<string[]>([''])
  const [validationError, setValidationError] = useState<string | null>(null)

  const existingQuery = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipe(id!, undefined, token),
    enabled: isEditing,
  })

  // Hydrates the form from the loaded recipe exactly once (guarded by id, not by
  // reference identity) — adjusting state during render, per React's guidance for
  // syncing state to a prop/query result, avoids the extra render pass (and the
  // react-hooks/set-state-in-effect lint error) that a useEffect-based sync would add.
  const [hydratedRecipeId, setHydratedRecipeId] = useState<string | undefined>(undefined)
  if (existingQuery.data && existingQuery.data.id !== hydratedRecipeId) {
    setHydratedRecipeId(existingQuery.data.id)
    setTitle(existingQuery.data.title)
    setDescription(existingQuery.data.description)
    setPortions(String(existingQuery.data.portions))
    setPrepTimeMinutes(String(existingQuery.data.prepTimeMinutes))
    if (existingQuery.data.ingredients.length > 0) {
      setIngredients(
        existingQuery.data.ingredients.map((ingredient) => ({
          name: '',
          quantity: String(ingredient.quantity),
          unit: ingredient.unit as MeasurementUnit,
        })),
      )
    }
    if (existingQuery.data.steps.length > 0) {
      setSteps(existingQuery.data.steps.map((step) => step.instruction))
    }
  }

  const publishMutation = useMutation({
    mutationFn: async (payload: RecipePayload) => {
      const saved = isEditing
        ? await updateRecipe(id!, payload, token!)
        : await createRecipe(payload, token!)
      return publishRecipe(saved.id, token!)
    },
    onSuccess: (published) => navigate(`/receitas/${published.id}`),
  })

  function validate(): string | null {
    if (!title.trim()) return t('recipes.validation_title_required')
    if (title.length > 120) return t('recipes.validation_title_max')
    if (!description.trim()) return t('recipes.validation_description_required')
    if (description.length > 2000) return t('recipes.validation_description_max')
    if (Number(portions) < 1) return t('recipes.validation_portions_min')
    if (Number(prepTimeMinutes) < 1) return t('recipes.validation_prep_time_min')
    if (ingredients.length === 0) return t('recipes.validation_ingredients_min')
    if (steps.length === 0) return t('recipes.validation_steps_min')
    return null
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const error = validate()
    setValidationError(error)
    if (error) return

    publishMutation.mutate({
      title,
      description,
      portions: Number(portions),
      prep_time_minutes: Number(prepTimeMinutes),
      ingredients: ingredients.map((ingredient, index) => ({
        ingredient_name: ingredient.name,
        quantity: Number(ingredient.quantity),
        unit: ingredient.unit,
        position: index,
      })),
      steps: steps.map((instruction, index) => ({ position: index, instruction })),
    })
  }

  return (
    <div className="recipe-form-page">
      <h1>{isEditing ? t('recipes.form_title_edit') : t('recipes.form_title_create')}</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor={`${formId}-title`}>{t('recipes.title_label')}</label>
        <input
          id={`${formId}-title`}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <label htmlFor={`${formId}-description`}>{t('recipes.description_label')}</label>
        <textarea
          id={`${formId}-description`}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <label htmlFor={`${formId}-portions`}>{t('recipes.portions_field_label')}</label>
        <input
          id={`${formId}-portions`}
          type="number"
          min={1}
          value={portions}
          onChange={(event) => setPortions(event.target.value)}
        />

        <label htmlFor={`${formId}-prep-time`}>{t('recipes.prep_time_label')}</label>
        <input
          id={`${formId}-prep-time`}
          type="number"
          min={1}
          value={prepTimeMinutes}
          onChange={(event) => setPrepTimeMinutes(event.target.value)}
        />

        <h2>{t('recipes.ingredients_section_title')}</h2>
        {ingredients.map((ingredient, index) => (
          <IngredientRow
            key={index}
            {...ingredient}
            onChange={(next) =>
              setIngredients((current) => current.map((row, i) => (i === index ? next : row)))
            }
            onRemove={() => setIngredients((current) => current.filter((_, i) => i !== index))}
          />
        ))}
        <button
          type="button"
          onClick={() => setIngredients((current) => [...current, emptyIngredient()])}
        >
          {t('recipes.add_ingredient_action')}
        </button>

        <h2>{t('recipes.steps_section_title')}</h2>
        {steps.map((instruction, index) => (
          <StepRow
            key={index}
            instruction={instruction}
            onChange={(next) =>
              setSteps((current) => current.map((step, i) => (i === index ? next : step)))
            }
            onRemove={() => setSteps((current) => current.filter((_, i) => i !== index))}
          />
        ))}
        <button type="button" onClick={() => setSteps((current) => [...current, ''])}>
          {t('recipes.add_step_action')}
        </button>

        {(validationError ||
          (publishMutation.isError &&
            (publishMutation.error instanceof ApiError
              ? publishMutation.error.message
              : t('recipes.form_error')))) && (
          <p role="alert">
            {validationError ||
              (publishMutation.error instanceof ApiError
                ? publishMutation.error.message
                : t('recipes.form_error'))}
          </p>
        )}

        <Button type="submit" disabled={publishMutation.isPending}>
          {publishMutation.isPending ? t('recipes.publishing_action') : t('recipes.publish_action')}
        </Button>
      </form>
    </div>
  )
}
