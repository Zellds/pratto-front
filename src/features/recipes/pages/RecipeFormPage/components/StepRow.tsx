import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import './StepRow.css'

type StepRowProps = {
  instruction: string
  onChange: (next: string) => void
  onRemove: () => void
}

export function StepRow({ instruction, onChange, onRemove }: StepRowProps) {
  const { t } = useTranslation()
  const inputId = useId()

  return (
    <div className="step-row">
      <label htmlFor={inputId}>{t('recipes.step_instruction_label')}</label>
      <textarea
        id={inputId}
        value={instruction}
        onChange={(event) => onChange(event.target.value)}
      />
      <button type="button" onClick={onRemove} aria-label={t('recipes.remove_step_action')}>
        ×
      </button>
    </div>
  )
}
