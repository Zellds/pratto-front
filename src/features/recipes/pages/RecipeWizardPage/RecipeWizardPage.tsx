import { useState, useId, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@/components/Button'
import { Skeleton } from '@/components/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import { ApiError } from '@/api/client'
import { getRecipe, createRecipe, updateRecipe, publishRecipe } from '../../api'
import type { RecipePayload, RecipeIngredientPayload, MeasurementUnit } from '../../types'
import { IngredientRow, type IngredientRowValue } from './components/IngredientRow'
import { StepLine } from './components/StepLine'
import { WizardSteps } from './components/WizardSteps'
import { WizardSummary } from './components/WizardSummary'
import { PrepPaper } from './components/PrepPaper'
import './RecipeWizardPage.css'

const STEP_IDS = ['basics', 'ingredients', 'preparation'] as const
type StepId = (typeof STEP_IDS)[number]

type DraftValues = {
  title: string
  description: string
  portions: string
  prepTimeMinutes: string
  ingredients: IngredientRowValue[]
  steps: string[]
}

function emptyIngredient(): IngredientRowValue {
  return { ingredientId: undefined, name: '', quantity: '', unit: 'unidade', isOptional: false }
}

function isIngredientFilled(ingredient: IngredientRowValue) {
  return Boolean(ingredient.ingredientId) || ingredient.name.trim().length > 0
}

function validateStep(stepId: StepId, values: DraftValues, t: TFunction): string | null {
  if (stepId === 'basics') {
    if (!values.title.trim()) return t('recipes.validation_title_required')
    if (values.title.length > 120) return t('recipes.validation_title_max')
    if (!values.description.trim()) return t('recipes.validation_description_required')
    if (values.description.length > 2000) return t('recipes.validation_description_max')
    if (Number(values.portions) < 1) return t('recipes.validation_portions_min')
    if (Number(values.prepTimeMinutes) < 1) return t('recipes.validation_prep_time_min')
    return null
  }
  if (stepId === 'ingredients') {
    if (values.ingredients.length === 0) return t('recipes.validation_ingredients_min')
    const hasIncompleteIngredient = values.ingredients.some(
      (ingredient) => !(Number(ingredient.quantity) > 0) || !isIngredientFilled(ingredient),
    )
    if (hasIncompleteIngredient) return t('recipes.validation_ingredient_incomplete')
    return null
  }
  if (values.steps.length === 0) return t('recipes.validation_steps_min')
  if (values.steps.some((instruction) => !instruction.trim())) {
    return t('recipes.validation_step_incomplete')
  }
  return null
}

export function RecipeWizardPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token, openAuthModal } = useAuth()
  const isEditing = !!id
  const formId = useId()

  const [currentIndex, setCurrentIndex] = useState(0)
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

  // Hydrates the draft from the loaded recipe exactly once (guarded by id) —
  // adjusting state during render, per React's guidance for syncing state to a
  // query result, avoids the extra render pass a useEffect-based sync would add.
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
          ingredientId: ingredient.ingredientId,
          name: ingredient.ingredientName ?? '',
          quantity: String(ingredient.quantity),
          unit: ingredient.unit as MeasurementUnit,
          isOptional: ingredient.isOptional,
        })),
      )
    }
    if (existingQuery.data.steps.length > 0) {
      setSteps(existingQuery.data.steps.map((step) => step.instruction))
    }
  }

  const publishMutation = useMutation({
    mutationFn: async ({ payload, authToken }: { payload: RecipePayload; authToken: string }) => {
      const saved = isEditing
        ? await updateRecipe(id!, payload, authToken)
        : await createRecipe(payload, authToken)
      return publishRecipe(saved.id, authToken)
    },
    onSuccess: (published) => navigate(`/receitas/${published.id}`),
  })

  if (isEditing && existingQuery.isLoading) {
    return <Skeleton className="recipe-wizard-page-skeleton" />
  }
  if (isEditing && existingQuery.isError) {
    return <EmptyState message={t('recipes.form_load_error')} />
  }

  const values: DraftValues = { title, description, portions, prepTimeMinutes, ingredients, steps }
  const currentStepId = STEP_IDS[currentIndex]
  const isLastStep = currentIndex === STEP_IDS.length - 1

  const stepTabs = STEP_IDS.map((stepId) => ({
    id: stepId,
    label: t(`recipes.wizard_step_${stepId}`),
    isComplete: validateStep(stepId, values, t) === null,
  }))

  function goToStep(index: number) {
    setValidationError(null)
    setCurrentIndex(index)
  }

  function handleNext() {
    const error = validateStep(currentStepId, values, t)
    setValidationError(error)
    if (error) return
    setCurrentIndex(currentIndex + 1)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isLastStep) {
      handleNext()
      return
    }

    for (const [index, stepId] of STEP_IDS.entries()) {
      const error = validateStep(stepId, values, t)
      if (error) {
        setCurrentIndex(index)
        setValidationError(error)
        return
      }
    }
    setValidationError(null)

    const payload: RecipePayload = {
      title,
      description,
      portions: Number(portions),
      prep_time_minutes: Number(prepTimeMinutes),
      ingredients: ingredients.map((ingredient, index): RecipeIngredientPayload => {
        const base = {
          quantity: Number(ingredient.quantity),
          unit: ingredient.unit,
          position: index,
          is_optional: ingredient.isOptional,
        }
        return ingredient.ingredientId
          ? { ...base, ingredient_id: ingredient.ingredientId }
          : { ...base, ingredient_name: ingredient.name }
      }),
      steps: steps.map((instruction, index) => ({ position: index, instruction })),
    }

    if (!token) {
      openAuthModal((freshToken) => publishMutation.mutate({ payload, authToken: freshToken }))
      return
    }
    publishMutation.mutate({ payload, authToken: token })
  }

  const serverError = publishMutation.isError
    ? publishMutation.error instanceof ApiError
      ? publishMutation.error.message
      : t('recipes.form_error')
    : null
  const shownError = validationError ?? serverError

  return (
    <div className="recipe-wizard-page">
      <h1>{isEditing ? t('recipes.form_title_edit') : t('recipes.form_title_create')}</h1>

      <WizardSteps steps={stepTabs} currentIndex={currentIndex} onSelect={goToStep} />

      <form onSubmit={handleSubmit} noValidate>
        <div className="wizard-layout">
          <div className="wizard-main">
            {currentStepId === 'basics' && (
              <div className="wizard-panel">
                <h2>{t('recipes.wizard_basics_heading')}</h2>
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

                <div className="wizard-panel-pair">
                  <div>
                    <label htmlFor={`${formId}-portions`}>
                      {t('recipes.portions_field_label')}
                    </label>
                    <input
                      id={`${formId}-portions`}
                      type="number"
                      min={1}
                      value={portions}
                      onChange={(event) => setPortions(event.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor={`${formId}-prep-time`}>{t('recipes.prep_time_label')}</label>
                    <input
                      id={`${formId}-prep-time`}
                      type="number"
                      min={1}
                      value={prepTimeMinutes}
                      onChange={(event) => setPrepTimeMinutes(event.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStepId === 'ingredients' && (
              <div className="wizard-panel wizard-ingredients">
                <h2>{t('recipes.ingredients_section_title')}</h2>
                <div className="wizard-ingredients-head" aria-hidden="true">
                  <span>{t('recipes.ingredient_name_label')}</span>
                  <span>{t('recipes.quantity_label')}</span>
                  <span>{t('recipes.unit_label')}</span>
                  <span>{t('recipes.optional_label')}</span>
                  <span />
                </div>
                {ingredients.map((ingredient, index) => (
                  <IngredientRow
                    key={index}
                    {...ingredient}
                    onChange={(next) =>
                      setIngredients((current) =>
                        current.map((row, i) => (i === index ? next : row)),
                      )
                    }
                    onRemove={() =>
                      setIngredients((current) => current.filter((_, i) => i !== index))
                    }
                  />
                ))}
                <button
                  type="button"
                  className="wizard-add-button"
                  onClick={() => setIngredients((current) => [...current, emptyIngredient()])}
                >
                  {t('recipes.add_ingredient_action')}
                </button>
              </div>
            )}

            {currentStepId === 'preparation' && (
              <PrepPaper>
                <h2>{t('recipes.steps_section_title')}</h2>
                {steps.map((instruction, index) => (
                  <StepLine
                    key={index}
                    stepNumber={index + 1}
                    instruction={instruction}
                    placeholder={t('recipes.step_placeholder')}
                    onChange={(next) =>
                      setSteps((current) => current.map((step, i) => (i === index ? next : step)))
                    }
                    onRemove={() => setSteps((current) => current.filter((_, i) => i !== index))}
                  />
                ))}
                <button type="button" onClick={() => setSteps((current) => [...current, ''])}>
                  {t('recipes.add_step_action')}
                </button>
              </PrepPaper>
            )}
          </div>

          <WizardSummary
            title={title}
            portions={portions}
            prepTimeMinutes={prepTimeMinutes}
            ingredientCount={ingredients.filter(isIngredientFilled).length}
            optionalCount={ingredients.filter((i) => isIngredientFilled(i) && i.isOptional).length}
            stepCount={steps.filter((instruction) => instruction.trim()).length}
          />
        </div>

        {shownError && (
          <p role="alert" className="wizard-error">
            {shownError}
          </p>
        )}

        {/*
          "Continuar" and "Publicar" carry different keys on purpose: they sit in the same
          spot, and without distinct keys React would reuse one <button> and flip its type
          to "submit" while the advancing click is still being dispatched — the browser
          would then submit the form on the click that merely moved to the last step.
        */}
        <div className="wizard-footer">
          {currentIndex > 0 ? (
            <Button type="button" variant="secondary" onClick={() => goToStep(currentIndex - 1)}>
              {t('recipes.wizard_back_action')}
            </Button>
          ) : (
            <span />
          )}
          {isLastStep ? (
            <Button key="publish" type="submit" disabled={publishMutation.isPending}>
              {publishMutation.isPending
                ? t('recipes.publishing_action')
                : t('recipes.publish_action')}
            </Button>
          ) : (
            <Button key="next" type="button" onClick={handleNext}>
              {t('recipes.wizard_next_action')}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
