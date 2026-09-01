import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { Layout } from './Layout'
import { ThemeProvider } from './ThemeProvider'
import { StubPage } from './StubPage'

function renderWithRouter(initialPath: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        Component: Layout,
        children: [
          { index: true, element: <StubPage titleKey="pages.dashboard" /> },
          { path: 'receitas', element: <StubPage titleKey="pages.recipes" /> },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  )

  return render(
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>,
  )
}

describe('Layout', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders the header and the matched child route', () => {
    renderWithRouter('/receitas')

    expect(screen.getByRole('heading', { name: 'Receitas' })).toBeInTheDocument()
    expect(screen.getByText('Em construção.')).toBeInTheDocument()
  })

  it('toggles the theme from the header', () => {
    renderWithRouter('/')

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')

    fireEvent.click(screen.getByRole('button', { name: /tema/i }))

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('toggles the language from the header', () => {
    renderWithRouter('/receitas')

    expect(screen.getByRole('heading', { name: 'Receitas' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /idioma/i }))

    expect(screen.getByRole('heading', { name: 'Recipes' })).toBeInTheDocument()
  })
})
