import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Sidebar } from './Sidebar'

function renderSidebar(isCollapsed = false, onToggleCollapse = vi.fn()) {
  return render(
    <MemoryRouter>
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} />
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
        <Sidebar isCollapsed={false} onToggleCollapse={vi.fn()} showCollapseToggle={false} />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('button', { name: 'Recolher menu' })).not.toBeInTheDocument()
  })
})
