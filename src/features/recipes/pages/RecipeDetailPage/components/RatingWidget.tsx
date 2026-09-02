import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/providers/AuthProvider'
import { useToast } from '@/providers/ToastProvider'
import { rateRecipe } from '../../../api'
import './RatingWidget.css'

const STAR_VALUES = [1, 2, 3, 4, 5]

type RatingWidgetProps = {
  recipeId: string
}

export function RatingWidget({ recipeId }: RatingWidgetProps) {
  const { t } = useTranslation()
  const { token, openAuthModal } = useAuth()
  const { showToast } = useToast()
  const [selected, setSelected] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  const mutation = useMutation({
    mutationFn: ({ score, authToken }: { score: number; authToken: string }) =>
      rateRecipe(recipeId, score, authToken),
    onSuccess: (_, variables) => {
      setSelected(variables.score)
      showToast(t('recipes.rate_success'))
    },
    onError: () => showToast(t('recipes.rate_error')),
  })

  function handleSelect(score: number) {
    if (!token) {
      openAuthModal((freshToken) => mutation.mutate({ score, authToken: freshToken }))
      return
    }
    mutation.mutate({ score, authToken: token })
  }

  const displayValue = hovered ?? selected ?? 0

  return (
    <div className="rating-widget" onMouseLeave={() => setHovered(null)}>
      <div className="rating-widget-stars">
        {STAR_VALUES.map((starValue) => {
          const fill =
            displayValue >= starValue ? '100%' : displayValue >= starValue - 0.5 ? '50%' : '0%'

          return (
            <span className="rating-widget-star" key={starValue}>
              <span className="rating-widget-star-bg" aria-hidden="true">
                ★
              </span>
              <span className="rating-widget-star-fill" style={{ width: fill }} aria-hidden="true">
                ★
              </span>
              <button
                type="button"
                className="rating-widget-half rating-widget-half-left"
                aria-label={t('recipes.rate_value', { value: starValue - 0.5 })}
                onMouseEnter={() => setHovered(starValue - 0.5)}
                onClick={() => handleSelect(starValue - 0.5)}
              />
              <button
                type="button"
                className="rating-widget-half rating-widget-half-right"
                aria-label={t('recipes.rate_value', { value: starValue })}
                onMouseEnter={() => setHovered(starValue)}
                onClick={() => handleSelect(starValue)}
              />
            </span>
          )
        })}
      </div>
      <p className="rating-widget-caption">
        {selected !== null
          ? t('recipes.your_rating', { score: selected })
          : t('recipes.rate_prompt')}
      </p>
    </div>
  )
}
