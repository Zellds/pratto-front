import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthProvider'

function AuthConsumer() {
  const { token, setToken, clearToken } = useAuth()
  return (
    <div>
      <span data-testid="current-token">{token ?? 'none'}</span>
      <button onClick={() => setToken('new-token')}>Set</button>
      <button onClick={clearToken}>Clear</button>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to no token', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId('current-token')).toHaveTextContent('none')
  })

  it('sets and persists the token', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    )

    fireEvent.click(screen.getByText('Set'))

    expect(screen.getByTestId('current-token')).toHaveTextContent('new-token')
    expect(localStorage.getItem('pratto-token')).toBe('new-token')
  })

  it('clears the token from state and localStorage', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    )

    fireEvent.click(screen.getByText('Set'))
    fireEvent.click(screen.getByText('Clear'))

    expect(screen.getByTestId('current-token')).toHaveTextContent('none')
    expect(localStorage.getItem('pratto-token')).toBeNull()
  })

  it('restores a previously-set token on remount', () => {
    localStorage.setItem('pratto-token', 'existing-token')

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId('current-token')).toHaveTextContent('existing-token')
  })
})
