import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Sidebar } from './Sidebar'

const defaultAuthProps = {
  isAuthenticated: false,
  displayName: '',
  onLogIn: vi.fn(),
  onLogOut: vi.fn(),
}

function renderSidebar(isCollapsed = false, onToggleCollapse = vi.fn()) {
  return render(
    <MemoryRouter>
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        {...defaultAuthProps}
      />
    </MemoryRouter>,
  )
}

function renderSidebarAt(path: string, isCollapsed = false) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={vi.fn()} {...defaultAuthProps} />
    </MemoryRouter>,
  )
}

describe('Sidebar', () => {
  it('renders every navigation link', () => {
    renderSidebar()

    expect(screen.getByRole('link', { name: /início/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /explorar/i })).toHaveAttribute('href', '/receitas')
    expect(screen.getByRole('link', { name: /categorias/i })).toHaveAttribute('href', '/categorias')
    expect(screen.getByRole('link', { name: /salvos/i })).toHaveAttribute('href', '/salvos')
    expect(screen.getByRole('link', { name: /minhas receitas/i })).toHaveAttribute(
      'href',
      '/minhas-receitas',
    )
    expect(screen.getByRole('link', { name: /despensa/i })).toHaveAttribute('href', '/despensa')
    expect(screen.getByRole('link', { name: /lista de compras/i })).toHaveAttribute(
      'href',
      '/lista-de-compras',
    )
    expect(screen.getByRole('link', { name: /cardápio/i })).toHaveAttribute('href', '/cardapio')
    expect(screen.getByRole('link', { name: /^chefs$/i })).toHaveAttribute('href', '/chefs')
    expect(screen.getByRole('link', { name: /ranking/i })).toHaveAttribute('href', '/ranking')
  })

  it('calls onToggleCollapse when the collapse button is clicked', () => {
    const onToggleCollapse = vi.fn()
    renderSidebar(false, onToggleCollapse)

    fireEvent.click(screen.getByRole('button', { name: 'Recolher menu' }))

    expect(onToggleCollapse).toHaveBeenCalledOnce()
  })

  it('shows the expand label when collapsed', () => {
    renderSidebar(true)

    expect(screen.getByRole('button', { name: 'Expandir menu' })).toBeInTheDocument()
  })

  it('hides the collapse toggle when showCollapseToggle is false', () => {
    render(
      <MemoryRouter>
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={vi.fn()}
          showCollapseToggle={false}
          {...defaultAuthProps}
        />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('button', { name: 'Recolher menu' })).not.toBeInTheDocument()
  })

  it('keeps every navigation link accessible by name when collapsed', () => {
    renderSidebar(true)

    expect(screen.getByRole('link', { name: /início/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /explorar/i })).toHaveAttribute('href', '/receitas')
    expect(screen.getByRole('link', { name: /categorias/i })).toHaveAttribute('href', '/categorias')
    expect(screen.getByRole('link', { name: /salvos/i })).toHaveAttribute('href', '/salvos')
    expect(screen.getByRole('link', { name: /minhas receitas/i })).toHaveAttribute(
      'href',
      '/minhas-receitas',
    )
    expect(screen.getByRole('link', { name: /despensa/i })).toHaveAttribute('href', '/despensa')
    expect(screen.getByRole('link', { name: /lista de compras/i })).toHaveAttribute(
      'href',
      '/lista-de-compras',
    )
    expect(screen.getByRole('link', { name: /cardápio/i })).toHaveAttribute('href', '/cardapio')
    expect(screen.getByRole('link', { name: /^chefs$/i })).toHaveAttribute('href', '/chefs')
    expect(screen.getByRole('link', { name: /ranking/i })).toHaveAttribute('href', '/ranking')
  })

  it('marks the link matching the current route as the active page', () => {
    renderSidebarAt('/receitas')

    expect(screen.getByRole('link', { name: /explorar/i })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /início/i })).not.toHaveAttribute('aria-current')
  })

  it('marks no link as active on an unmatched route', () => {
    renderSidebarAt('/categorias')

    expect(screen.getByRole('link', { name: /categorias/i })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('shows a log-in prompt in the footer when there is no session', () => {
    const onLogIn = vi.fn()
    render(
      <MemoryRouter>
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={vi.fn()}
          {...defaultAuthProps}
          onLogIn={onLogIn}
        />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(onLogIn).toHaveBeenCalledOnce()
  })

  it('shows the display name and a log-out action in the footer when authenticated', () => {
    const onLogOut = vi.fn()
    render(
      <MemoryRouter>
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={vi.fn()}
          {...defaultAuthProps}
          isAuthenticated
          displayName="Gabriel Medeiros"
          onLogOut={onLogOut}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText('Gabriel Medeiros')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }))

    expect(onLogOut).toHaveBeenCalledOnce()
  })
})
