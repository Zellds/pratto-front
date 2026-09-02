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

  it('has a page heading for the document outline', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    renderDashboard()

    expect(screen.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeInTheDocument()
  })

  it('shows hero and card skeletons while loading', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))

    renderDashboard()

    expect(document.querySelector('.hero-skeleton-photo')).toBeInTheDocument()
    expect(document.querySelectorAll('.recipe-card-skeleton')).toHaveLength(3)
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

  it('numbers the popular recipes and shows disabled sorting tabs', async () => {
    const recipes = [
      makeRecipe('1', 3.0),
      makeRecipe('2', 4.9),
      makeRecipe('3', 4.5),
      makeRecipe('4', 4.0),
    ]
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(recipes) }),
    )

    renderDashboard()

    expect(await screen.findByText('#1')).toBeInTheDocument()
    expect(screen.getByText('#2')).toBeInTheDocument()
    expect(screen.getByText('#3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'da semana' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'do mês' })).toBeDisabled()
  })

  it('still shows the view-all link when there are no recipes at all', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    renderDashboard()

    expect(await screen.findByText('Nenhuma receita encontrada.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver todas' })).toHaveAttribute('href', '/receitas')
    expect(screen.getByRole('link', { name: 'Publicar receita' })).toHaveAttribute(
      'href',
      '/nova-receita',
    )
  })
})
