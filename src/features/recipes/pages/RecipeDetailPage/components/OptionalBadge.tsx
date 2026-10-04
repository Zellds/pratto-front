import { useTranslation } from 'react-i18next'
import './OptionalBadge.css'

export function OptionalBadge() {
  const { t } = useTranslation()

  return <span className="optional-badge">{t('recipes.optional_badge')}</span>
}
