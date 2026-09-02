import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router'
import { AuthProvider } from '@/providers/AuthProvider'
import { RecipeDetailPage } from './RecipeDetailPage'

function renderPage(id = '1') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter initialEntries={[`/receitas/${id}`]}>
          <Routes>
            <Route path="/receitas/:id" element={<RecipeDetailPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

const SAMPLE_RECIPE = {
  id: '1',
  ownerId: 'o1',
  ownerUsername: 'gabriel',
  ownerDisplayName: 'Gabriel Medeiros',
  title: 'Bolo de cenoura',
  description: 'Bolo simples e rápido',
  portions: 8,
  prepTimeMinutes: 60,
  status: 'published',
  coverMediaId: null,
  coverThumbnailUrl: null,
  coverDisplayUrl: null,
  rejectionReason: null,
  averageRating: 4.5,
  ratingsCount: 12,
  ingredients: [{ ingredientId: 'i1', quantity: 3, unit: 'unidade', position: 0 }],
  steps: [{ position: 0, instruction: 'Bata tudo no liquidificador.' }],
}

describe('RecipeDetailPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows a loading state while the recipe is being fetched', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))

    renderPage()

    expect(document.querySelectorAll('.skeleton').length).toBeGreaterThan(0)
  })

  it('renders the recipe title, ingredients and portions control once loaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(SAMPLE_RECIPE) }),
    )

    renderPage()

    expect(await screen.findByText('Bolo de cenoura')).toBeInTheDocument()
    expect(screen.getByText(/3.*unidade/)).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('Bata tudo no liquidificador.')).toBeInTheDocument()
  })

  it('shows a not-found message when the recipe does not exist', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Not found' }),
      }),
    )

    renderPage()

    expect(await screen.findByText('Receita não encontrada.')).toBeInTheDocument()
  })
})
