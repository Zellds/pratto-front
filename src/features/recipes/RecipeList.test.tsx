import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecipeList } from './RecipeList'

function renderRecipeList(props: { showSearch?: boolean; showPagination?: boolean } = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <RecipeList {...props} />
    </QueryClientProvider>,
  )
}

describe('RecipeList', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('shows a loading state, then the empty message when there are no recipes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    renderRecipeList()

    expect(await screen.findByText('Nenhuma receita encontrada.')).toBeInTheDocument()
  })

  it('shows the recipes returned by the API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve([
            {
              id: '1',
              ownerId: 'o1',
              title: 'Bolo de cenoura',
              description: '',
              portions: 8,
              prepTimeMinutes: 60,
              status: 'published',
              coverMediaId: null,
              rejectionReason: null,
              averageRating: null,
              ratingsCount: 0,
              ingredients: [],
              steps: [],
            },
          ]),
      }),
    )

    renderRecipeList()

    expect(await screen.findByText('Bolo de cenoura')).toBeInTheDocument()
  })

  it('shows an error message when the request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Server error' }),
      }),
    )

    renderRecipeList()

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('debounces the search input before refetching', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const mockFetch = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) })
    vi.stubGlobal('fetch', mockFetch)

    renderRecipeList({ showSearch: true })
    await vi.waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1))

    fireEvent.change(screen.getByLabelText('Buscar receitas'), { target: { value: 'bolo' } })

    vi.advanceTimersByTime(299)
    expect(mockFetch).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(1)
    await vi.waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    expect(mockFetch.mock.calls[1][0]).toContain('q=bolo')
  })

  it('navigates pagination with the previous/next buttons', async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) })
    vi.stubGlobal('fetch', mockFetch)

    renderRecipeList({ showPagination: true })
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1))
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }))
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    expect(mockFetch.mock.calls[1][0]).toContain('page=2')

    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }))
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(3))
    expect(mockFetch.mock.calls[2][0]).toContain('page=1')
  })
})
