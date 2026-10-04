import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StepsSheet } from './StepsSheet'

const STEPS = [
  { position: 1, instruction: 'Asse por 40 minutos.' },
  { position: 0, instruction: 'Bata tudo no liquidificador.' },
]

describe('StepsSheet', () => {
  it('shows the section heading', () => {
    render(<StepsSheet steps={STEPS} />)

    expect(screen.getByRole('heading', { name: 'Modo de preparo' })).toBeInTheDocument()
  })

  it('renders steps in position order, numbered starting at 1', () => {
    render(<StepsSheet steps={STEPS} />)

    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('1.')
    expect(items[0]).toHaveTextContent('Bata tudo no liquidificador.')
    expect(items[1]).toHaveTextContent('2.')
    expect(items[1]).toHaveTextContent('Asse por 40 minutos.')
  })
})
