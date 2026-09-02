import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { AuthProvider } from '@/providers/AuthProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import { RatingWidget } from './RatingWidget'

function renderWidget() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <RatingWidget recipeId="r1" />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>,
  )
}

describe('RatingWidget', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it('sends the rating directly when the user is already authenticated', async () => {
    localStorage.setItem('pratto-token', 'tok123')
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 'rt1', recipeId: 'r1', userId: 'u1', score: 3.5 }),
    })
    vi.stubGlobal('fetch', mockFetch)

    renderWidget()

    fireEvent.click(screen.getByLabelText('Avaliar com 3.5 estrelas'))

    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toContain('/recipes/r1/rating')
    expect(JSON.parse(init.body)).toEqual({ score: 3.5 })
  })

  it('opens the login modal and does not call the API when logged out', () => {
    const mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)

    renderWidget()

    fireEvent.click(screen.getByLabelText('Avaliar com 4 estrelas'))

    expect(mockFetch).not.toHaveBeenCalled()
  })
})
