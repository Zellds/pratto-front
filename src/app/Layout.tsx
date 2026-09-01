import { Outlet, Link } from 'react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useTheme } from './ThemeProvider'
import { useAuth } from './AuthProvider'
import { apiFetch, ApiError } from '../shared/api/client'
import { AuthModal } from '../features/auth/AuthModal'
import { Sidebar } from './Sidebar'

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
  const { theme, toggleTheme } = useTheme()
  const { token, clearToken } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(readStoredSidebarCollapsed)

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
    <div className="app-shell">
      <div className="app-shell-desktop">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={toggleSidebarCollapse} />
      </div>

      <div className="app-shell-main">
        <header className="app-topbar">
          <Link to="/">Pratto</Link>
          <button onClick={toggleTheme} aria-label={t('common.toggle_theme')}>
            {theme === 'light' ? t('common.theme_dark') : t('common.theme_light')}
          </button>
          <button onClick={toggleLanguage} aria-label={t('common.toggle_language')}>
            {i18n.resolvedLanguage === 'pt-BR' ? 'EN' : 'PT'}
          </button>
          {token ? (
            <>
              <span>{meQuery.data?.displayName ?? ''}</span>
              <button onClick={clearToken}>{t('common.log_out')}</button>
            </>
          ) : (
            <button onClick={() => setIsAuthModalOpen(true)}>{t('common.log_in')}</button>
          )}
          <button
            className="app-mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label={t('common.open_menu')}
          >
            {t('common.menu')}
          </button>
        </header>
        <main>
          <Outlet />
        </main>
      </div>

      {isMobileMenuOpen && (
        <div className="app-mobile-sheet" role="dialog" aria-modal="true">
          <button onClick={() => setIsMobileMenuOpen(false)} aria-label={t('common.close_menu')}>
            {t('common.close_menu')}
          </button>
          <Sidebar isCollapsed={false} onToggleCollapse={() => {}} showCollapseToggle={false} />
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}
