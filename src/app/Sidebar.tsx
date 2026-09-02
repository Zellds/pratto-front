import { Link, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { CollapseIcon } from '../shared/ui/icons'
import { MAIN_ITEMS, KITCHEN_ITEMS, COMMUNITY_ITEMS, initials, type NavItem } from './navItems'
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
