import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PortionsControl } from './PortionsControl'

describe('PortionsControl', () => {
  it('calls onChange with value + 1 when the increase button is clicked', () => {
    const onChange = vi.fn()
    render(<PortionsControl value={4} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Aumentar porções' }))

    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('calls onChange with value - 1 when the decrease button is clicked', () => {
    const onChange = vi.fn()
    render(<PortionsControl value={4} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Diminuir porções' }))

    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('disables the decrease button at 1 portion and never calls onChange below 1', () => {
    const onChange = vi.fn()
    render(<PortionsControl value={1} onChange={onChange} />)

    expect(screen.getByRole('button', { name: 'Diminuir porções' })).toBeDisabled()
  })
})
