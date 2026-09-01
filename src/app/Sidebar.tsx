import { Link, useLocation } from 'react-router'
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
  isAuthenticated: boolean
  displayName: string
  onLogIn: () => void
  onLogOut: () => void
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

type NavItem = {
  to: string
  labelKey: string
  Icon: (props: { size?: number }) => React.JSX.Element
}

const MAIN_ITEMS: NavItem[] = [
  { to: '/', labelKey: 'nav.home', Icon: HomeIcon },
  { to: '/receitas', labelKey: 'nav.explore', Icon: ExploreIcon },
  { to: '/categorias', labelKey: 'nav.categories', Icon: CategoriesIcon },
  { to: '/salvos', labelKey: 'nav.saved', Icon: SavedIcon },
]

const KITCHEN_ITEMS: NavItem[] = [
  { to: '/minhas-receitas', labelKey: 'nav.my_recipes', Icon: MyRecipesIcon },
  { to: '/despensa', labelKey: 'nav.pantry', Icon: PantryIcon },
  { to: '/lista-de-compras', labelKey: 'nav.shopping_list', Icon: ShoppingListIcon },
  { to: '/cardapio', labelKey: 'nav.weekly_menu', Icon: WeeklyMenuIcon },
]

const COMMUNITY_ITEMS: NavItem[] = [
  { to: '/chefs', labelKey: 'nav.chefs', Icon: ChefsIcon },
  { to: '/ranking', labelKey: 'nav.ranking', Icon: RankingIcon },
]

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  showCollapseToggle = true,
  isAuthenticated,
  displayName,
  onLogIn,
  onLogOut,
}: SidebarProps) {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  function renderItem({ to, labelKey, Icon }: NavItem) {
    const isActive = pathname === to
    return (
      <Link key={to} to={to} aria-label={t(labelKey)} aria-current={isActive ? 'page' : undefined}>
        <Icon />
        <span>{t(labelKey)}</span>
      </Link>
    )
  }

  return (
    <aside className={`sidebar${isCollapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-header">
        <Link to="/" className="sidebar-brand" aria-label="Pratto">
          <span className="sidebar-brand-full">
            Prat<span className="brand-accent">to</span>
          </span>
          <span className="sidebar-brand-mark" aria-hidden="true">
            P
          </span>
        </Link>
      </div>

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
        {MAIN_ITEMS.map(renderItem)}

        <div className="sidebar-section-label">{t('nav.section_kitchen')}</div>

        {KITCHEN_ITEMS.map(renderItem)}

        <div className="sidebar-section-label">{t('nav.section_community')}</div>

        {COMMUNITY_ITEMS.map(renderItem)}
      </nav>

      <div className="sidebar-footer">
        {isAuthenticated ? (
          <>
            <div className="sidebar-footer-avatar" aria-hidden="true">
              {initials(displayName)}
            </div>
            <span className="sidebar-footer-name">{displayName}</span>
            <button onClick={onLogOut} className="sidebar-footer-action">
              {t('common.log_out')}
            </button>
          </>
        ) : (
          <button onClick={onLogIn} className="sidebar-footer-action">
            {t('common.log_in')}
          </button>
        )}
      </div>
    </aside>
  )
}
