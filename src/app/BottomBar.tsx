import { Link, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { HomeIcon, ExploreIcon, PlusIcon, MenuIcon, ProfileIcon } from '../shared/ui/icons'
import { initials } from './navItems'
import './BottomBar.css'

type BottomBarProps = {
  isAuthenticated: boolean
  displayName: string
  onOpenMenu: () => void
}

export function BottomBar({ isAuthenticated, displayName, onOpenMenu }: BottomBarProps) {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  return (
    <nav className="bottom-bar">
      <Link to="/" aria-current={pathname === '/' ? 'page' : undefined}>
        <HomeIcon size={22} />
        <span>{t('nav.home')}</span>
      </Link>
      <Link to="/receitas" aria-current={pathname === '/receitas' ? 'page' : undefined}>
        <ExploreIcon size={22} />
        <span>{t('nav.explore')}</span>
      </Link>
      <Link to="/nova-receita" className="bottom-bar-fab" aria-label={t('common.new_recipe')}>
        <PlusIcon size={22} />
      </Link>
      <button onClick={onOpenMenu} className="bottom-bar-profile" aria-label={t('nav.profile')}>
        <span className="bottom-bar-avatar" aria-hidden="true">
          {isAuthenticated ? initials(displayName) : <ProfileIcon size={13} />}
        </span>
        <span aria-hidden="true">{t('nav.profile')}</span>
      </button>
      <button onClick={onOpenMenu} aria-label={t('common.open_menu')}>
        <MenuIcon size={22} />
        <span aria-hidden="true">{t('common.menu')}</span>
      </button>
    </nav>
  )
}
