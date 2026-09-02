import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('renders its children', () => {
    render(
      <Card>
        <p>Conteúdo do card</p>
      </Card>,
    )

    expect(screen.getByText('Conteúdo do card')).toBeInTheDocument()
  })

  it('renders children inside a card-body wrapper when given one', () => {
    render(
      <Card>
        <div className="card-body">
          <p>Conteúdo com padding</p>
        </div>
      </Card>,
    )

    expect(screen.getByText('Conteúdo com padding').closest('.card-body')).toBeInTheDocument()
  })
})
