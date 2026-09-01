import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../../app/AuthProvider'
import { AuthModal } from './AuthModal'

function renderAuthModal(onClose = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthModal isOpen onClose={onClose} />
      </AuthProvider>
    </QueryClientProvider>,
  )
  return { onClose }
}

describe('AuthModal', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it('starts on the login tab', () => {
    renderAuthModal()

    expect(screen.getByLabelText('Usuário')).toBeInTheDocument()
    expect(screen.queryByLabelText('Nome de exibição')).not.toBeInTheDocument()
  })

  it('switches to the register tab', () => {
    renderAuthModal()

    fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(screen.getByLabelText('Nome de exibição')).toBeInTheDocument()
  })

  it('closes and persists the token when login succeeds', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ token: 'abc123' }),
    })
    vi.stubGlobal('fetch', mockFetch)
    const { onClose } = renderAuthModal()

    fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: 'gabriel' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce())
    expect(localStorage.getItem('pratto-token')).toBe('abc123')
  })
})
