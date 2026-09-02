import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders the message', () => {
    render(<EmptyState message="Nada por aqui ainda." />)

    expect(screen.getByText('Nada por aqui ainda.')).toBeInTheDocument()
  })

  it('renders an optional action', () => {
    render(<EmptyState message="Nada por aqui ainda." action={<button>Fazer algo</button>} />)

    expect(screen.getByRole('button', { name: 'Fazer algo' })).toBeInTheDocument()
  })

  it('renders without an action', () => {
    render(<EmptyState message="Nada por aqui ainda." />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
