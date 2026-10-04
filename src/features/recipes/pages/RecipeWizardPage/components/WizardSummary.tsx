import { useTranslation } from 'react-i18next'
import './WizardSummary.css'

type WizardSummaryProps = {
  title: string
  portions: string
  prepTimeMinutes: string
  ingredientCount: number
  optionalCount: number
  stepCount: number
}

export function WizardSummary({
  title,
  portions,
  prepTimeMinutes,
  ingredientCount,
  optionalCount,
  stepCount,
}: WizardSummaryProps) {
  const { t } = useTranslation()
  const trimmedTitle = title.trim()

  return (
    <aside className="wizard-summary" aria-label={t('recipes.wizard_summary_title')}>
      <h2>{t('recipes.wizard_summary_title')}</h2>
      <p className={trimmedTitle ? 'wizard-summary-name' : 'wizard-summary-name is-empty'}>
        {trimmedTitle || t('recipes.wizard_summary_untitled')}
      </p>
      <p className="wizard-summary-meta">
        {t('recipes.wizard_summary_meta', { portions, minutes: prepTimeMinutes })}
      </p>
      <p>
        {t(
          ingredientCount === 1
            ? 'recipes.wizard_summary_ingredients_single'
            : 'recipes.wizard_summary_ingredients_multiple',
          { count: ingredientCount },
        )}
        {optionalCount > 0 && (
          <span className="wizard-summary-chip">
            {t(
              optionalCount === 1
                ? 'recipes.wizard_summary_optional_single'
                : 'recipes.wizard_summary_optional_multiple',
              { count: optionalCount },
            )}
          </span>
        )}
      </p>
      <p className="wizard-summary-meta">
        {t(
          stepCount === 1
            ? 'recipes.wizard_summary_steps_single'
            : 'recipes.wizard_summary_steps_multiple',
          { count: stepCount },
        )}
      </p>
    </aside>
  )
}
