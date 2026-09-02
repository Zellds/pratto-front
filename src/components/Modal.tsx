import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'
import './Modal.css'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  ariaLabelledBy?: string
  fullScreen?: boolean
}

export function Modal({
  isOpen,
  onClose,
  children,
  ariaLabelledBy,
  fullScreen = false,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null

      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
        'input, button, textarea, select, a[href]',
      )
      firstFocusable?.focus()
    } else {
      previouslyFocusedElementRef.current?.focus()
      previouslyFocusedElementRef.current = null
    }
  }, [isOpen])

  if (!isOpen) return null

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" data-testid="modal-overlay" onClick={handleOverlayClick}>
      <div
        ref={panelRef}
        className={`modal-panel${fullScreen ? ' modal-panel-fullscreen' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
      >
        {children}
      </div>
    </div>
  )
}
