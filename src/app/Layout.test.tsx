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
          { index: true, element: <StubPage title="Dashboard" /> },
          { path: 'receitas', element: <StubPage title="Receitas" /> },
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

    // getByText('Receitas') is ambiguous here: the header nav has a "Receitas" link
    // AND the matched stub page renders an <h1>Receitas</h1> — both have the exact
    // same text. Scoping to the heading role disambiguates while still asserting
    // the actual behavior under test (the matched child route rendered).
    expect(screen.getByRole('heading', { name: 'Receitas' })).toBeInTheDocument()
    expect(screen.getByText('Em construção.')).toBeInTheDocument()
  })

  it('toggles the theme from the header', () => {
    renderWithRouter('/')

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')

    fireEvent.click(screen.getByRole('button', { name: /tema/i }))

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
