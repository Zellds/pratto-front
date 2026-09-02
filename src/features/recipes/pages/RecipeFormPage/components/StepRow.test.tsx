import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StepRow } from './StepRow'

describe('StepRow', () => {
  it('calls onChange when typing the instruction', () => {
    const onChange = vi.fn()
    render(<StepRow instruction="" onChange={onChange} onRemove={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('Instrução'), { target: { value: 'Bata tudo.' } })

    expect(onChange).toHaveBeenCalledWith('Bata tudo.')
  })

  it('calls onRemove when the remove button is clicked', () => {
    const onRemove = vi.fn()
    render(<StepRow instruction="" onChange={vi.fn()} onRemove={onRemove} />)

    fireEvent.click(screen.getByRole('button', { name: 'Remover passo' }))

    expect(onRemove).toHaveBeenCalled()
  })
})
