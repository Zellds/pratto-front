import { useTranslation } from 'react-i18next'
import './WizardSteps.css'

export type WizardStepTab = {
  id: string
  label: string
  isComplete: boolean
}

type WizardStepsProps = {
  steps: WizardStepTab[]
  currentIndex: number
  onSelect: (index: number) => void
}

export function WizardSteps({ steps, currentIndex, onSelect }: WizardStepsProps) {
  const { t } = useTranslation()

  return (
    <nav aria-label={t('recipes.wizard_steps_label')}>
      <ol className="wizard-steps">
        {steps.map((step, index) => {
          const isCurrent = index === currentIndex
          const classes = [
            'wizard-step',
            isCurrent && 'wizard-step-current',
            step.isComplete && !isCurrent && 'wizard-step-complete',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <li key={step.id} className="wizard-steps-item">
              <button
                type="button"
                className={classes}
                aria-current={isCurrent ? 'step' : undefined}
                onClick={() => onSelect(index)}
              >
                <span className="wizard-step-dot" aria-hidden="true">
                  {step.isComplete && !isCurrent ? '✓' : index + 1}
                </span>
                <span className="wizard-step-label">{step.label}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
