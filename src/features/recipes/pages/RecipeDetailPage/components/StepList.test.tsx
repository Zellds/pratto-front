import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StepList } from './StepList'

const STEPS = [
  { position: 1, instruction: 'Asse por 40 minutos.' },
  { position: 0, instruction: 'Bata tudo no liquidificador.' },
]

describe('StepList', () => {
  it('renders steps in position order, numbered starting at 1', () => {
    render(<StepList steps={STEPS} />)

    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('1.')
    expect(items[0]).toHaveTextContent('Bata tudo no liquidificador.')
    expect(items[1]).toHaveTextContent('2.')
    expect(items[1]).toHaveTextContent('Asse por 40 minutos.')
  })
})
