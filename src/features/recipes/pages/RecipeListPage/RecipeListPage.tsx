import { useTranslation } from 'react-i18next'
import { RecipeList } from './components/RecipeList'

export function RecipeListPage() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('recipes.list_title')}</h1>
      <RecipeList showSearch showPagination />
    </div>
  )
}
