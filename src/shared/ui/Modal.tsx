import { useEffect, type MouseEvent, type ReactNode } from 'react'
import './Modal.css'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" data-testid="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-panel" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  )
}
