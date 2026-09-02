import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ToastProvider, useToast } from './ToastProvider'

function ToastTrigger() {
  const { showToast } = useToast()
  return (
    <>
      <button onClick={() => showToast('Deu certo!')}>Show success</button>
      <button onClick={() => showToast('Deu ruim.', 'error')}>Show error</button>
    </>
  )
}

function renderWithToast() {
  return render(
    <ToastProvider>
      <ToastTrigger />
    </ToastProvider>,
  )
}

describe('ToastProvider', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a toast when showToast is called', () => {
    renderWithToast()

    fireEvent.click(screen.getByText('Show success'))

    expect(screen.getByText('Deu certo!')).toBeInTheDocument()
  })

  it('shows multiple toasts at once', () => {
    renderWithToast()

    fireEvent.click(screen.getByText('Show success'))
    fireEvent.click(screen.getByText('Show error'))

    expect(screen.getByText('Deu certo!')).toBeInTheDocument()
    expect(screen.getByText('Deu ruim.')).toBeInTheDocument()
  })

  it('dismisses a toast when its close button is clicked', () => {
    renderWithToast()

    fireEvent.click(screen.getByText('Show success'))
    fireEvent.click(screen.getByRole('button', { name: 'Fechar notificação' }))

    expect(screen.queryByText('Deu certo!')).not.toBeInTheDocument()
  })

  it('auto-dismisses a toast after a timeout', () => {
    vi.useFakeTimers()
    renderWithToast()

    fireEvent.click(screen.getByText('Show success'))
    expect(screen.getByText('Deu certo!')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(4000)
    })

    expect(screen.queryByText('Deu certo!')).not.toBeInTheDocument()
  })

  it('throws when useToast is used outside a ToastProvider', () => {
    function Orphan() {
      useToast()
      return null
    }

    expect(() => render(<Orphan />)).toThrow('useToast must be used within a ToastProvider')
  })
})
