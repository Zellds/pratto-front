import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StepLine } from './StepLine'

describe('StepLine', () => {
  it('renders the step number', () => {
    render(<StepLine stepNumber={3} instruction="" onChange={vi.fn()} onRemove={vi.fn()} />)

    expect(screen.getByText('3.')).toBeInTheDocument()
  })

  it('calls onChange when typing the instruction', () => {
    const onChange = vi.fn()
    render(<StepLine stepNumber={1} instruction="" onChange={onChange} onRemove={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('Instrução'), { target: { value: 'Bata tudo.' } })

    expect(onChange).toHaveBeenCalledWith('Bata tudo.')
  })

  it('calls onRemove when the remove button is clicked', () => {
    const onRemove = vi.fn()
    render(<StepLine stepNumber={1} instruction="" onChange={vi.fn()} onRemove={onRemove} />)

    fireEvent.click(screen.getByRole('button', { name: 'Remover passo' }))

    expect(onRemove).toHaveBeenCalled()
  })
})
