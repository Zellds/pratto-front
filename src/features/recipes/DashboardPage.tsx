import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { RecipeList } from './RecipeList'

export function DashboardPage() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('recipes.dashboard_title')}</h1>
      <RecipeList />
      <Link to="/receitas">{t('recipes.view_all')}</Link>
    </div>
  )
}
