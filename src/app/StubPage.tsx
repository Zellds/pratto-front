import { useTranslation } from 'react-i18next'

export function StubPage({ titleKey }: { titleKey: string }) {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t(titleKey)}</h1>
      <p>{t('common.under_construction')}</p>
    </div>
  )
}
