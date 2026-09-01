import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from './Modal'

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>Conteúdo</p>
      </Modal>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders its children when isOpen is true', () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <p>Conteúdo</p>
      </Modal>,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('calls onClose when the Escape key is pressed', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen onClose={handleClose}>
        <p>Conteúdo</p>
      </Modal>,
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(handleClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when clicking outside the panel', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen onClose={handleClose}>
        <p>Conteúdo</p>
      </Modal>,
    )

    fireEvent.click(screen.getByTestId('modal-overlay'))

    expect(handleClose).toHaveBeenCalledOnce()
  })

  it('does not call onClose when clicking inside the panel', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen onClose={handleClose}>
        <p>Conteúdo</p>
      </Modal>,
    )

    fireEvent.click(screen.getByText('Conteúdo'))

    expect(handleClose).not.toHaveBeenCalled()
  })
})
