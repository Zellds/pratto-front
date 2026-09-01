import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './Layout'
import { ThemeProvider } from './ThemeProvider'
import { AuthProvider } from './AuthProvider'
import { DashboardPage } from '../features/recipes/DashboardPage'
import { RecipeListPage } from '../features/recipes/RecipeListPage'

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
      <AuthProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AuthProvider>
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

    expect(await screen.findByRole('heading', { name: 'Receitas em destaque' })).toBeInTheDocument()
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
