import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Salvar</Button>)

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Salvar</Button>)

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(
      <Button onClick={handleClick} disabled>
        Salvar
      </Button>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(handleClick).not.toHaveBeenCalled()
  })
})
