import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  HomeIcon,
  ExploreIcon,
  CategoriesIcon,
  SavedIcon,
  MyRecipesIcon,
  PantryIcon,
  ShoppingListIcon,
  WeeklyMenuIcon,
  ChefsIcon,
  RankingIcon,
  CollapseIcon,
} from '../shared/ui/icons'
import './Sidebar.css'

type SidebarProps = {
  isCollapsed: boolean
  onToggleCollapse: () => void
  showCollapseToggle?: boolean
}

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  showCollapseToggle = true,
}: SidebarProps) {
  const { t } = useTranslation()

  return (
    <aside className={`sidebar${isCollapsed ? ' collapsed' : ''}`}>
      {showCollapseToggle && (
        <button
          className="sidebar-collapse"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? t('common.expand_sidebar') : t('common.collapse_sidebar')}
        >
          <CollapseIcon />
        </button>
      )}

      <nav className="sidebar-nav">
        <Link to="/" aria-label={t('nav.home')}>
          <HomeIcon />
          <span>{t('nav.home')}</span>
        </Link>
        <Link to="/receitas" aria-label={t('nav.explore')}>
          <ExploreIcon />
          <span>{t('nav.explore')}</span>
        </Link>
        <Link to="/categorias" aria-label={t('nav.categories')}>
          <CategoriesIcon />
          <span>{t('nav.categories')}</span>
        </Link>
        <Link to="/salvos" aria-label={t('nav.saved')}>
          <SavedIcon />
          <span>{t('nav.saved')}</span>
        </Link>

        <div className="sidebar-section-label">{t('nav.section_kitchen')}</div>

        <Link to="/minhas-receitas" aria-label={t('nav.my_recipes')}>
          <MyRecipesIcon />
          <span>{t('nav.my_recipes')}</span>
        </Link>
        <Link to="/despensa" aria-label={t('nav.pantry')}>
          <PantryIcon />
          <span>{t('nav.pantry')}</span>
        </Link>
        <Link to="/lista-de-compras" aria-label={t('nav.shopping_list')}>
          <ShoppingListIcon />
          <span>{t('nav.shopping_list')}</span>
        </Link>
        <Link to="/cardapio" aria-label={t('nav.weekly_menu')}>
          <WeeklyMenuIcon />
          <span>{t('nav.weekly_menu')}</span>
        </Link>

        <div className="sidebar-section-label">{t('nav.section_community')}</div>

        <Link to="/chefs" aria-label={t('nav.chefs')}>
          <ChefsIcon />
          <span>{t('nav.chefs')}</span>
        </Link>
        <Link to="/ranking" aria-label={t('nav.ranking')}>
          <RankingIcon />
          <span>{t('nav.ranking')}</span>
        </Link>
      </nav>
    </aside>
  )
}
