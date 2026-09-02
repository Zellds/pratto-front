import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from '../layouts/Layout'
import { ThemeProvider } from '../providers/ThemeProvider'
import { AuthProvider } from '../providers/AuthProvider'
import { DashboardPage } from '../features/recipes/pages/DashboardPage/DashboardPage'
import { RecipeListPage } from '../features/recipes/pages/RecipeListPage/RecipeListPage'
import { ToastProvider } from '../providers/ToastProvider'

function renderAt(initialPath: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        Component: Layout,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'receitas', element: <RecipeListPage /> },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  )
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>,
  )
}

describe('routing', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the dashboard at the root path', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    renderAt('/')

    // DashboardPage no longer has a single page-level <h1> title (Task 11 replaced it
    // with a composition of Hero + section-level <h2>s derived from the recipe list).
    // With an empty recipe list, Hero/Populares/Descubra don't render, but the
    // always-present ChefsSection heading confirms DashboardPage rendered.
    expect(await screen.findByRole('heading', { name: 'Chefs' })).toBeInTheDocument()
  })

  it('renders the recipe list page at /receitas', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    renderAt('/receitas')

    expect(await screen.findByRole('heading', { name: 'Receitas' })).toBeInTheDocument()
    expect(screen.getByLabelText('Buscar receitas')).toBeInTheDocument()
  })
})
