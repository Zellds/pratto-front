import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import './StepLine.css'

type StepLineProps = {
  stepNumber: number
  instruction: string
  onChange: (next: string) => void
  onRemove: () => void
  placeholder?: string
}

export function StepLine({
  stepNumber,
  instruction,
  onChange,
  onRemove,
  placeholder,
}: StepLineProps) {
  const { t } = useTranslation()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Grows the textarea to fit its own content — runs on every value change,
  // not just user typing, so a step hydrated from an existing recipe (edit
  // mode) sizes correctly on arrival too, not only after the user next types.
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [instruction])

  return (
    <div className="step-line">
      <span className="step-line-number">{stepNumber}.</span>
      <textarea
        ref={textareaRef}
        rows={1}
        value={instruction}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-label={t('recipes.step_instruction_label')}
      />
      <button type="button" onClick={onRemove} aria-label={t('recipes.remove_step_action')}>
        ×
      </button>
    </div>
  )
}
