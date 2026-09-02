import { Outlet, Link, useNavigate } from 'react-router'
import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useTheme } from './ThemeProvider'
import { useAuth } from './AuthProvider'
import { apiFetch, ApiError } from '../api/client'
import { AuthModal } from '../features/auth/AuthModal'
import { Modal } from '../components/Modal'
import { useToast } from '../shared/ui/ToastProvider'
import { Sidebar } from './Sidebar'
import { BottomBar } from './BottomBar'
import { MobileMenuSheet } from './MobileMenuSheet'
import {
  SearchIcon,
  NotificationIcon,
  PlusIcon,
  ThemeIcon,
  FlagBrazilIcon,
  FlagUnitedStatesIcon,
} from '../components/icons'
import './Layout.css'

type MeResponse = {
  username: string
  displayName: string
}

const SIDEBAR_STORAGE_KEY = 'pratto-sidebar-collapsed'

function readStoredSidebarCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function Layout() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { token, clearToken, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth()
  const { showToast } = useToast()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(readStoredSidebarCollapsed)
  const [searchQuery, setSearchQuery] = useState('')

  const meQuery = useQuery({
    queryKey: ['me', token],
    queryFn: () => apiFetch<MeResponse>('/me', { token }),
    enabled: !!token,
    retry: false,
  })

  useEffect(() => {
    if (meQuery.error instanceof ApiError && meQuery.error.status === 401) {
      clearToken()
    }
  }, [meQuery.error, clearToken])

  function handleLogOut() {
    clearToken()
    showToast(t('common.logged_out'))
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = searchQuery.trim()
    navigate(trimmed ? `/receitas?q=${encodeURIComponent(trimmed)}` : '/receitas')
  }

  function toggleLanguage() {
    i18n.changeLanguage(i18n.resolvedLanguage === 'pt-BR' ? 'en' : 'pt-BR')
  }

  function toggleSidebarCollapse() {
    setIsSidebarCollapsed((current) => {
      const next = !current
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next))
      } catch {
        // localStorage unavailable — collapse state still works in-memory
      }
      return next
    })
  }

  return (
    <div className={`app-shell${isSidebarCollapsed ? ' app-shell-collapsed' : ''}`}>
      <div className="app-shell-desktop">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
          isAuthenticated={!!token}
          displayName={meQuery.data?.displayName ?? ''}
          onLogIn={openAuthModal}
          onLogOut={handleLogOut}
        />
      </div>

      <div className="app-shell-main">
        <header className="app-topbar">
          <div className="app-topbar-lead">
            <Link to="/" className="app-brand-mobile" aria-label="Pratto">
              Prat<span className="brand-accent">to</span>
            </Link>
          </div>

          <form className="app-search" role="search" onSubmit={handleSearchSubmit}>
            <SearchIcon />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('common.search_placeholder')}
              aria-label={t('common.search_placeholder')}
            />
          </form>

          <div className="app-topbar-tools">
            <button
              onClick={toggleTheme}
              aria-label={t('common.toggle_theme')}
              title={theme === 'light' ? t('common.theme_dark') : t('common.theme_light')}
              className="app-icon-button"
            >
              <ThemeIcon />
            </button>
            <button
              onClick={toggleLanguage}
              aria-label={t('common.toggle_language')}
              title={i18n.resolvedLanguage === 'pt-BR' ? 'English' : 'Português'}
              className="app-icon-button"
            >
              {i18n.resolvedLanguage === 'pt-BR' ? <FlagUnitedStatesIcon /> : <FlagBrazilIcon />}
            </button>
            <button
              disabled
              aria-label={t('common.notifications')}
              title={t('common.notifications_disabled_hint')}
              className="app-icon-button"
            >
              <NotificationIcon />
            </button>
            <Link to="/nova-receita" className="button button-primary">
              <PlusIcon />
              {t('common.new_recipe')}
            </Link>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>

      <BottomBar
        isAuthenticated={!!token}
        displayName={meQuery.data?.displayName ?? ''}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
      />

      <Modal
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        fullScreen
        ariaLabelledBy="mobile-menu-heading"
      >
        <MobileMenuSheet
          onClose={() => setIsMobileMenuOpen(false)}
          isAuthenticated={!!token}
          username={meQuery.data?.username ?? ''}
          displayName={meQuery.data?.displayName ?? ''}
          onLogIn={openAuthModal}
          onLogOut={handleLogOut}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </Modal>

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  )
}
