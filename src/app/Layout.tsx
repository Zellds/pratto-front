import { Outlet, Link } from 'react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useTheme } from './ThemeProvider'
import { useAuth } from './AuthProvider'
import { apiFetch, ApiError } from '../shared/api/client'
import { AuthModal } from '../features/auth/AuthModal'

type MeResponse = {
  displayName: string
}

export function Layout() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const { token, clearToken } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

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

  return (
    <div>
      <header>
        <Link to="/">Pratto</Link>
        <nav>
          <Link to="/receitas">{t('nav.recipes')}</Link>
          <Link to="/lista-de-compras">{t('nav.shopping_list')}</Link>
          <Link to="/despensa">{t('nav.pantry')}</Link>
          <Link to="/cardapio">{t('nav.weekly_menu')}</Link>
          <Link to="/chat">{t('nav.chat')}</Link>
        </nav>
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
      </header>
      <main>
        <Outlet />
      </main>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}
