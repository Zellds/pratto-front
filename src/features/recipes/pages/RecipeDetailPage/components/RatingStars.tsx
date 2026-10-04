import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import './RatingStars.css'

type RatingStarsProps = {
  value: number
}

export function RatingStars({ value }: RatingStarsProps) {
  const { t } = useTranslation()

  return (
    <span
      className="rating-stars"
      role="img"
      aria-label={t('recipes.rating_stars_label', { value })}
      style={{ '--rating-value': value } as CSSProperties}
    >
      ★★★★★
    </span>
  )
}
