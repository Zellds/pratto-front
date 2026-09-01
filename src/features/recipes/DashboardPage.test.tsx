import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../../app/AuthProvider'
import { DashboardPage } from './DashboardPage'

function makeRecipe(id: string, averageRating: number | null) {
  return {
    id,
    ownerId: `owner-${id}`,
    ownerUsername: null,
    ownerDisplayName: null,
    title: `Receita ${id}`,
    description: '',
    portions: 4,
    prepTimeMinutes: 30,
    status: 'published' as const,
    coverMediaId: null,
    coverThumbnailUrl: null,
    coverDisplayUrl: null,
    rejectionReason: null,
    averageRating,
    ratingsCount: averageRating !== null ? 5 : 0,
    ingredients: [],
    steps: [],
  }
}

function renderDashboard() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe('DashboardPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the highest-rated recipe as the hero and the rest split across sections', async () => {
    const recipes = [
      makeRecipe('1', 3.0),
      makeRecipe('2', 4.9),
      makeRecipe('3', 4.5),
      makeRecipe('4', 4.0),
      makeRecipe('5', null),
    ]
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(recipes) }),
    )

    renderDashboard()

    expect(await screen.findByRole('heading', { name: 'Receita 2' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Populares' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Descubra' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Chefs' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'De quem você segue' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver todas' })).toHaveAttribute('href', '/receitas')
  })

  it('renders nothing extra when there are no recipes at all', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    renderDashboard()

    expect(await screen.findByText('Nenhuma receita encontrada.')).toBeInTheDocument()
  })
})
