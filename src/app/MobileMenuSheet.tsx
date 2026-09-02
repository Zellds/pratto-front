import { Link, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { CloseIcon, ProfileIcon } from '../shared/ui/icons'
import { MAIN_ITEMS, KITCHEN_ITEMS, COMMUNITY_ITEMS, initials, type NavItem } from './navItems'
import './MobileMenuSheet.css'

type MobileMenuSheetProps = {
  onClose: () => void
  isAuthenticated: boolean
  username: string
  displayName: string
  onLogIn: () => void
  onLogOut: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export function MobileMenuSheet({
  onClose,
  isAuthenticated,
  username,
  displayName,
  onLogIn,
  onLogOut,
  theme,
  onToggleTheme,
}: MobileMenuSheetProps) {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  function renderItem({ to, labelKey }: NavItem) {
    const isActive = pathname === to
    return (
      <Link
        key={to}
        to={to}
        onClick={onClose}
        aria-current={isActive ? 'page' : undefined}
        className="sheet-item"
      >
        {t(labelKey)}
      </Link>
    )
  }

  return (
    <>
      <div className="sheet-head">
        <Link to="/" onClick={onClose} className="sheet-brand" aria-label="Pratto">
          Prat<span className="brand-accent">to</span>
        </Link>
        <button onClick={onClose} aria-label={t('common.close_menu')} className="app-icon-button">
          <CloseIcon />
        </button>
      </div>

      {isAuthenticated ? (
        <Link to={`/perfil/${username}`} onClick={onClose} className="sheet-profile">
          <span className="sheet-profile-avatar" aria-hidden="true">
            {initials(displayName)}
          </span>
          <span className="sheet-profile-name">{displayName}</span>
        </Link>
      ) : (
        <button onClick={onLogIn} className="sheet-profile">
          <span className="sheet-profile-avatar" aria-hidden="true">
            <ProfileIcon size={18} />
          </span>
          <span className="sheet-profile-name">{t('common.log_in')}</span>
        </button>
      )}

      <h2 id="mobile-menu-heading" className="sr-only">
        {t('common.menu')}
      </h2>

      <div className="sheet-group-label">{t('nav.section_discover')}</div>
      <div className="sheet-items">{MAIN_ITEMS.map(renderItem)}</div>

      <div className="sheet-group-label">{t('nav.section_kitchen')}</div>
      <div className="sheet-items">{KITCHEN_ITEMS.map(renderItem)}</div>

      <div className="sheet-group-label">{t('nav.section_community')}</div>
      <div className="sheet-items">{COMMUNITY_ITEMS.map(renderItem)}</div>

      <div className="sheet-group-label">{t('nav.section_account')}</div>
      <div className="sheet-items">
        <Link to="/configuracoes" onClick={onClose} className="sheet-item">
          {t('pages.settings')}
        </Link>
        <button onClick={onToggleTheme} className="sheet-item">
          {theme === 'light' ? t('common.theme_dark') : t('common.theme_light')}
        </button>
        {isAuthenticated && (
          <button onClick={onLogOut} className="sheet-item">
            {t('common.log_out')}
          </button>
        )}
      </div>
    </>
  )
}
