import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/providers/AuthProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import { AuthModal } from '@/features/auth/components/AuthModal'
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

  it('sends the fresh login token in the Authorization header when resuming a rating after login', async () => {
    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/login')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ token: 'fresh-login-token' }),
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 'rt1', recipeId: 'r1', userId: 'u1', score: 4 }),
      })
    })
    vi.stubGlobal('fetch', mockFetch)

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

    function Wrapper() {
      const { isAuthModalOpen, closeAuthModal } = useAuth()
      return (
        <>
          <RatingWidget recipeId="r1" />
          <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
        </>
      )
    }

    render(
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <Wrapper />
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>,
    )

    // Logged out: clicking a star opens the login modal instead of calling the API.
    fireEvent.click(screen.getByLabelText('Avaliar com 4 estrelas'))
    expect(mockFetch).not.toHaveBeenCalled()

    // Complete the login through the real AuthModal UI.
    fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: 'gabriel' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/recipes/r1/rating'),
        expect.anything(),
      ),
    )

    const ratingCall = mockFetch.mock.calls.find(([url]) => url.includes('/recipes/r1/rating'))
    expect(ratingCall).toBeDefined()
    const [, init] = ratingCall!
    expect(init.headers.Authorization).toBe('Bearer fresh-login-token')
  })
})
