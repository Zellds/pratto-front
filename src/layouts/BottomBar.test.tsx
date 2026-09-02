import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { BottomBar } from './BottomBar'

function renderBottomBar(props: Partial<Parameters<typeof BottomBar>[0]> = {}) {
  const onOpenMenu = vi.fn()
  render(
    <MemoryRouter>
      <BottomBar isAuthenticated={false} displayName="" onOpenMenu={onOpenMenu} {...props} />
    </MemoryRouter>,
  )
  return { onOpenMenu }
}

describe('BottomBar', () => {
  it('links to home and explore', () => {
    renderBottomBar()

    expect(screen.getByRole('link', { name: /início/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /explorar/i })).toHaveAttribute('href', '/receitas')
  })

  it('links the new-recipe shortcut to the stub route', () => {
    renderBottomBar()

    expect(screen.getByRole('link', { name: 'Nova receita' })).toHaveAttribute(
      'href',
      '/nova-receita',
    )
  })

  it('opens the menu when the profile button is clicked', () => {
    const { onOpenMenu } = renderBottomBar()

    fireEvent.click(screen.getByRole('button', { name: 'Perfil' }))

    expect(onOpenMenu).toHaveBeenCalledOnce()
  })

  it('opens the menu when the menu button is clicked', () => {
    const { onOpenMenu } = renderBottomBar()

    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))

    expect(onOpenMenu).toHaveBeenCalledOnce()
  })

  it('shows initials in the profile button when authenticated', () => {
    renderBottomBar({ isAuthenticated: true, displayName: 'Gabriel Medeiros' })

    expect(screen.getByText('GM')).toBeInTheDocument()
  })
})
