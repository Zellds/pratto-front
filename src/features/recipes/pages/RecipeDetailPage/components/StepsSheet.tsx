import { useTranslation } from 'react-i18next'
import { PaperSheet } from '@/components/PaperSheet/PaperSheet'
import type { RecipeStep } from '../../../types'
import './StepsSheet.css'

type StepsSheetProps = {
  steps: RecipeStep[]
}

export function StepsSheet({ steps }: StepsSheetProps) {
  const { t } = useTranslation()
  const sorted = [...steps].sort((a, b) => a.position - b.position)

  return (
    <PaperSheet as="section" className="steps-sheet">
      <h2 className="steps-sheet-heading">{t('recipes.steps_title')}</h2>
      <ol className="steps-sheet-list">
        {sorted.map((step, index) => (
          <li key={step.position}>
            <span className="steps-sheet-number">{index + 1}.</span> {step.instruction}
          </li>
        ))}
      </ol>
    </PaperSheet>
  )
}
