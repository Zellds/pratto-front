import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PaperSheet } from './PaperSheet'

describe('PaperSheet', () => {
  it('renders its content', () => {
    render(
      <PaperSheet>
        <p>Bata tudo no liquidificador.</p>
      </PaperSheet>,
    )

    expect(screen.getByText('Bata tudo no liquidificador.')).toBeInTheDocument()
  })

  it('renders as a section landmark when asked to', () => {
    render(
      <PaperSheet as="section" aria-label="Modo de preparo">
        <p>Passo 1</p>
      </PaperSheet>,
    )

    expect(screen.getByRole('region', { name: 'Modo de preparo' })).toBeInTheDocument()
  })

  it('keeps the decorative tape out of the accessibility tree', () => {
    const { container } = render(
      <PaperSheet>
        <p>Passo 1</p>
      </PaperSheet>,
    )

    expect(container.querySelector('.paper-sheet-tape')).toHaveAttribute('aria-hidden', 'true')
  })

  it('lets the caller extend the sheet with its own class', () => {
    const { container } = render(
      <PaperSheet className="custom-sheet">
        <p>Passo 1</p>
      </PaperSheet>,
    )

    expect(container.firstElementChild).toHaveClass('paper-sheet', 'custom-sheet')
  })
})
