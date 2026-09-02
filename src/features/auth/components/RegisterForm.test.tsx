import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RegisterForm } from './RegisterForm'

function renderRegisterForm(onSuccess = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <RegisterForm onSuccess={onSuccess} />
    </QueryClientProvider>,
  )
  return { onSuccess }
}

describe('RegisterForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does not submit when fields are empty', () => {
    const mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
    renderRegisterForm()

    fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('calls onSuccess with the token on a successful registration', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ token: 'new-token', user: { id: '1' } }),
    })
    vi.stubGlobal('fetch', mockFetch)
    const { onSuccess } = renderRegisterForm()

    fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: 'gabriel' } })
    fireEvent.change(screen.getByLabelText('Nome de exibição'), {
      target: { value: 'Gabriel' },
    })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith('new-token'))
  })

  it('shows the backend error message on a duplicate username', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: () => Promise.resolve({ message: 'Username already exists' }),
    })
    vi.stubGlobal('fetch', mockFetch)
    renderRegisterForm()

    fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: 'gabriel' } })
    fireEvent.change(screen.getByLabelText('Nome de exibição'), {
      target: { value: 'Gabriel' },
    })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Username already exists')
  })
})
