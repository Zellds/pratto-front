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
        <Link to="/">
          <HomeIcon />
          <span>{t('nav.home')}</span>
        </Link>
        <Link to="/receitas">
          <ExploreIcon />
          <span>{t('nav.explore')}</span>
        </Link>
        <Link to="/categorias">
          <CategoriesIcon />
          <span>{t('nav.categories')}</span>
        </Link>
        <Link to="/salvos">
          <SavedIcon />
          <span>{t('nav.saved')}</span>
        </Link>

        <div className="sidebar-section-label">{t('nav.section_kitchen')}</div>

        <Link to="/minhas-receitas">
          <MyRecipesIcon />
          <span>{t('nav.my_recipes')}</span>
        </Link>
        <Link to="/despensa">
          <PantryIcon />
          <span>{t('nav.pantry')}</span>
        </Link>
        <Link to="/lista-de-compras">
          <ShoppingListIcon />
          <span>{t('nav.shopping_list')}</span>
        </Link>
        <Link to="/cardapio">
          <WeeklyMenuIcon />
          <span>{t('nav.weekly_menu')}</span>
        </Link>

        <div className="sidebar-section-label">{t('nav.section_community')}</div>

        <Link to="/chefs">
          <ChefsIcon />
          <span>{t('nav.chefs')}</span>
        </Link>
        <Link to="/ranking">
          <RankingIcon />
          <span>{t('nav.ranking')}</span>
        </Link>
      </nav>
    </aside>
  )
}
