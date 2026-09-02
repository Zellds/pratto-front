import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChefsSection } from './ChefsSection'

describe('ChefsSection', () => {
  it('renders the section title and 3 example chef cards', () => {
    render(<ChefsSection />)

    expect(screen.getByRole('heading', { name: 'Chefs' })).toBeInTheDocument()
    expect(screen.getByText('Chef exemplo 1')).toBeInTheDocument()
    expect(screen.getByText('Chef exemplo 2')).toBeInTheDocument()
    expect(screen.getByText('Chef exemplo 3')).toBeInTheDocument()
  })

  it('renders every follow button as disabled', () => {
    render(<ChefsSection />)

    const followButtons = screen.getAllByRole('button', { name: 'Seguir' })

    expect(followButtons).toHaveLength(3)
    followButtons.forEach((button) => expect(button).toBeDisabled())
  })
})
