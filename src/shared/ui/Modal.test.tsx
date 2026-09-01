import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from './Modal'

function ModalHost() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Abrir modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <input aria-label="Campo" />
      </Modal>
    </div>
  )
}

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

  it('moves focus to the first focusable element inside the panel when it opens', () => {
    render(<ModalHost />)

    const openButton = screen.getByRole('button', { name: 'Abrir modal' })
    openButton.focus()
    fireEvent.click(openButton)

    expect(screen.getByLabelText('Campo')).toHaveFocus()
  })

  it('restores focus to the previously focused element when it closes', () => {
    render(<ModalHost />)

    const openButton = screen.getByRole('button', { name: 'Abrir modal' })
    openButton.focus()
    fireEvent.click(openButton)
    expect(screen.getByLabelText('Campo')).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(openButton).toHaveFocus()
  })
})
