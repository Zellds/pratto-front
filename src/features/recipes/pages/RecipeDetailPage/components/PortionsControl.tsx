import { useTranslation } from 'react-i18next'
import './PortionsControl.css'

type PortionsControlProps = {
  value: number
  onChange: (next: number) => void
}

export function PortionsControl({ value, onChange }: PortionsControlProps) {
  const { t } = useTranslation()

  return (
    <div className="portions-control">
      <span className="portions-control-label">{t('recipes.portions_label')}</span>
      <div className="portions-control-stepper">
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          disabled={value <= 1}
          aria-label={t('recipes.decrease_portions')}
        >
          −
        </button>
        <span aria-live="polite">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          aria-label={t('recipes.increase_portions')}
        >
          +
        </button>
      </div>
    </div>
  )
}
