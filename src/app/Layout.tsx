import { Outlet, Link } from 'react-router'
import { useTheme } from './ThemeProvider'

export function Layout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div>
      <header>
        <Link to="/">Pratto</Link>
        <nav>
          <Link to="/receitas">Receitas</Link>
          <Link to="/lista-de-compras">Lista de compras</Link>
          <Link to="/despensa">Despensa</Link>
          <Link to="/cardapio">Cardápio</Link>
          <Link to="/chat">Chat</Link>
        </nav>
        <button onClick={toggleTheme} aria-label="Alternar tema">
          {theme === 'light' ? 'Escuro' : 'Claro'}
        </button>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
