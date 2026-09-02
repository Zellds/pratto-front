import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginForm } from './LoginForm'

function renderLoginForm(onSuccess = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <LoginForm onSuccess={onSuccess} />
    </QueryClientProvider>,
  )
  return { onSuccess }
}

describe('LoginForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does not submit when fields are empty', () => {
    const mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
    renderLoginForm()

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('calls onSuccess with the token on a successful login', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ token: 'abc123' }),
    })
    vi.stubGlobal('fetch', mockFetch)
    const { onSuccess } = renderLoginForm()

    fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: 'gabriel' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith('abc123'))
  })

  it('shows the backend error message on invalid credentials', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: () => Promise.resolve({ message: 'Invalid credentials' }),
    })
    vi.stubGlobal('fetch', mockFetch)
    renderLoginForm()

    fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: 'gabriel' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials')
  })
})
