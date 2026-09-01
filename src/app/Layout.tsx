import { Outlet, Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useTheme } from './ThemeProvider'

export function Layout() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()

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
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
