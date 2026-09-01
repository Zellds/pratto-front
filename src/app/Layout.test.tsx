import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './Layout'
import { ThemeProvider } from './ThemeProvider'
import { AuthProvider } from './AuthProvider'
import { StubPage } from './StubPage'

function renderWithRouter(initialPath: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        Component: Layout,
        children: [
          { index: true, element: <StubPage titleKey="pages.new_recipe" /> },
          { path: 'receitas', element: <StubPage titleKey="pages.pantry" /> },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  )

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe('Layout', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the header and the matched child route', () => {
    renderWithRouter('/receitas')

    expect(screen.getByRole('heading', { name: 'Despensa' })).toBeInTheDocument()
    expect(screen.getByText('Em construção.')).toBeInTheDocument()
  })

  it('toggles the theme from the header', () => {
    renderWithRouter('/')

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')

    fireEvent.click(screen.getByRole('button', { name: /tema/i }))

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('toggles the language from the header', () => {
    renderWithRouter('/receitas')

    fireEvent.click(screen.getByRole('button', { name: /idioma/i }))

    expect(screen.getByRole('heading', { name: 'Pantry' })).toBeInTheDocument()
  })

  it('shows a log-in button when there is no session', () => {
    renderWithRouter('/')

    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('opens the auth modal when the log-in button is clicked', () => {
    renderWithRouter('/')

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('shows the display name and a log-out button when a session exists', async () => {
    localStorage.setItem('pratto-token', 'abc123')
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ displayName: 'Gabriel' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    renderWithRouter('/')

    expect(await screen.findByText('Gabriel')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
  })

  it('logs out and shows the log-in button again when clicking log out', async () => {
    localStorage.setItem('pratto-token', 'abc123')
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ displayName: 'Gabriel' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    renderWithRouter('/')
    await screen.findByText('Gabriel')

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }))

    expect(await screen.findByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('falls back to the logged-out state when the session is invalid', async () => {
    localStorage.setItem('pratto-token', 'expired-token')
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'Unauthenticated' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    renderWithRouter('/')

    expect(await screen.findByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('keeps the session when the /me request fails for a reason other than 401', async () => {
    localStorage.setItem('pratto-token', 'abc123')
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'Server error' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    renderWithRouter('/')

    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
    expect(screen.queryByRole('button', { name: 'Entrar' })).not.toBeInTheDocument()
    expect(localStorage.getItem('pratto-token')).toBe('abc123')
  })

  it('persists the sidebar collapse state to localStorage', () => {
    renderWithRouter('/')

    // O sheet mobile só entra no DOM depois de "Abrir menu" (renderização
    // condicional) — nestes dois testes ele nunca abre, então só existe uma
    // sidebar (a desktop) no DOM, `getByRole` singular funciona normalmente.
    fireEvent.click(screen.getByRole('button', { name: 'Recolher menu' }))

    expect(localStorage.getItem('pratto-sidebar-collapsed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Expandir menu' })).toBeInTheDocument()
  })

  it('restores a previously-collapsed sidebar on mount', () => {
    localStorage.setItem('pratto-sidebar-collapsed', 'true')

    renderWithRouter('/')

    expect(screen.getByRole('button', { name: 'Expandir menu' })).toBeInTheDocument()
  })

  it('opens the full-screen mobile menu sheet', () => {
    renderWithRouter('/')

    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))

    // A partir daqui a sidebar desktop E a do sheet mobile coexistem no DOM
    // (só uma escondida via CSS, que o jsdom não aplica) — escopar a busca
    // dentro do próprio `role="dialog"` do sheet evita a ambiguidade.
    const sheet = screen.getByRole('dialog')
    expect(within(sheet).getByRole('link', { name: /categorias/i })).toBeInTheDocument()
  })
})
