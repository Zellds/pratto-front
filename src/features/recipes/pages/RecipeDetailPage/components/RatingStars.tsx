import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { formatNumber } from '@/utils/formatNumber'
import './RatingStars.css'

type RatingStarsProps = {
  value: number
}

export function RatingStars({ value }: RatingStarsProps) {
  const { t, i18n } = useTranslation()

  return (
    <span
      className="rating-stars"
      role="img"
      aria-label={t('recipes.rating_stars_label', { value: formatNumber(value, i18n.language, 1) })}
      style={{ '--rating-value': value } as CSSProperties}
    >
      ★★★★★
    </span>
  )
}
