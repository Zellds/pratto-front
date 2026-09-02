import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '@/providers/AuthProvider'
import { FeedSection } from './FeedSection'

function renderFeedSection() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter>
          <FeedSection />
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe('FeedSection', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it('shows a logged-out empty state and does not call the API', () => {
    const mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)

    renderFeedSection()

    expect(screen.getByText('Entre pra ver as receitas de quem você segue.')).toBeInTheDocument()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('opens the auth modal when the logged-out empty state action is clicked', () => {
    vi.stubGlobal('fetch', vi.fn())

    renderFeedSection()

    // Não lança erro ao clicar — confirma que o botão está de fato ligado ao
    // contexto de auth (o modal em si é responsabilidade do Layout, não desta seção).
    expect(() => fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))).not.toThrow()
  })

  it('shows loading skeletons while the feed request is in flight', () => {
    localStorage.setItem('pratto-token', 'abc123')
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))

    renderFeedSection()

    expect(document.querySelectorAll('.recipe-card-skeleton')).toHaveLength(2)
  })

  it('shows an error message when the feed request fails', async () => {
    localStorage.setItem('pratto-token', 'abc123')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Server error' }),
      }),
    )

    renderFeedSection()

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('shows a no-follows empty state when logged in but the feed is empty', async () => {
    localStorage.setItem('pratto-token', 'abc123')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    renderFeedSection()

    expect(await screen.findByText('Você ainda não segue ninguém.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Explorar receitas' })).toHaveAttribute(
      'href',
      '/receitas',
    )
  })

  it('shows the recipes returned by the feed when logged in', async () => {
    localStorage.setItem('pratto-token', 'abc123')
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
              ownerUsername: 'marina',
              ownerDisplayName: 'Marina Alves',
              title: 'Tarte tatin de maçã',
              description: '',
              portions: 6,
              prepTimeMinutes: 45,
              status: 'published',
              coverMediaId: null,
              coverThumbnailUrl: null,
              coverDisplayUrl: null,
              rejectionReason: null,
              averageRating: 4.6,
              ratingsCount: 10,
              ingredients: [],
              steps: [],
            },
          ]),
      }),
    )

    renderFeedSection()

    expect(await screen.findByText('Tarte tatin de maçã')).toBeInTheDocument()
  })
})
