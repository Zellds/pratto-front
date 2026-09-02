import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthProvider'

function AuthConsumer() {
  const { token, setToken, clearToken, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth()
  return (
    <div>
      <span data-testid="current-token">{token ?? 'none'}</span>
      <span data-testid="modal-state">{isAuthModalOpen ? 'open' : 'closed'}</span>
      <button onClick={() => setToken('new-token')}>Set</button>
      <button onClick={clearToken}>Clear</button>
      <button onClick={() => openAuthModal()}>Open modal</button>
      <button onClick={closeAuthModal}>Close modal</button>
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

  it('starts with the auth modal closed and toggles it via openAuthModal/closeAuthModal', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId('modal-state')).toHaveTextContent('closed')

    fireEvent.click(screen.getByText('Open modal'))
    expect(screen.getByTestId('modal-state')).toHaveTextContent('open')

    fireEvent.click(screen.getByText('Close modal'))
    expect(screen.getByTestId('modal-state')).toHaveTextContent('closed')
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

  it('exposes the onSuccess callback passed to openAuthModal as pendingAction', () => {
    function Consumer() {
      const { openAuthModal, pendingAction } = useAuth()
      return (
        <div>
          <button onClick={() => openAuthModal(() => {})}>open</button>
          <span data-testid="has-pending">{pendingAction ? 'yes' : 'no'}</span>
        </div>
      )
    }

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId('has-pending')).toHaveTextContent('no')
    fireEvent.click(screen.getByText('open'))
    expect(screen.getByTestId('has-pending')).toHaveTextContent('yes')
  })

  it('defaults pendingAction to null when openAuthModal is called with no callback', () => {
    function Consumer() {
      const { openAuthModal, pendingAction } = useAuth()
      return (
        <div>
          <button onClick={() => openAuthModal()}>open</button>
          <span data-testid="has-pending">{pendingAction ? 'yes' : 'no'}</span>
        </div>
      )
    }

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )

    fireEvent.click(screen.getByText('open'))
    expect(screen.getByTestId('has-pending')).toHaveTextContent('no')
  })
})
