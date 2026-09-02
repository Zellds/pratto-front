import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { MobileMenuSheet } from './MobileMenuSheet'

function renderSheet(props: Partial<Parameters<typeof MobileMenuSheet>[0]> = {}) {
  const onClose = vi.fn()
  const onLogIn = vi.fn()
  const onLogOut = vi.fn()
  const onToggleTheme = vi.fn()
  render(
    <MemoryRouter>
      <MobileMenuSheet
        onClose={onClose}
        isAuthenticated={false}
        username=""
        displayName=""
        onLogIn={onLogIn}
        onLogOut={onLogOut}
        theme="light"
        onToggleTheme={onToggleTheme}
        {...props}
      />
    </MemoryRouter>,
  )
  return { onClose, onLogIn, onLogOut, onToggleTheme }
}

describe('MobileMenuSheet', () => {
  it('renders every navigation item grouped by section', () => {
    renderSheet()

    expect(screen.getByRole('link', { name: 'Categorias' })).toHaveAttribute('href', '/categorias')
    expect(screen.getByRole('link', { name: 'Despensa' })).toHaveAttribute('href', '/despensa')
    expect(screen.getByRole('link', { name: 'Chefs' })).toHaveAttribute('href', '/chefs')
  })

  it('closes when a navigation link is clicked', () => {
    const { onClose } = renderSheet()

    fireEvent.click(screen.getByRole('link', { name: 'Categorias' }))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('shows a log-in prompt when there is no session', () => {
    const { onLogIn } = renderSheet()

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(onLogIn).toHaveBeenCalledOnce()
  })

  it('links to the profile page when authenticated', () => {
    renderSheet({ isAuthenticated: true, username: 'gabriel', displayName: 'Gabriel Medeiros' })

    expect(screen.getByRole('link', { name: /Gabriel Medeiros/i })).toHaveAttribute(
      'href',
      '/perfil/gabriel',
    )
  })

  it('does not show a log-out action when there is no session', () => {
    renderSheet()

    expect(screen.queryByRole('button', { name: 'Sair' })).not.toBeInTheDocument()
  })

  it('logs out when the log-out action is clicked', () => {
    const { onLogOut } = renderSheet({
      isAuthenticated: true,
      username: 'gabriel',
      displayName: 'Gabriel Medeiros',
    })

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }))

    expect(onLogOut).toHaveBeenCalledOnce()
  })

  it('toggles the theme', () => {
    const { onToggleTheme } = renderSheet()

    fireEvent.click(screen.getByRole('button', { name: 'Escuro' }))

    expect(onToggleTheme).toHaveBeenCalledOnce()
  })

  it('closes when the close button is clicked', () => {
    const { onClose } = renderSheet()

    fireEvent.click(screen.getByRole('button', { name: 'Fechar menu' }))

    expect(onClose).toHaveBeenCalledOnce()
  })
})
