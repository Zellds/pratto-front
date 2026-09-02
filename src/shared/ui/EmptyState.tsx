import type { ReactNode } from 'react'
import './EmptyState.css'

type EmptyStateProps = {
  message: string
  action?: ReactNode
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p>{message}</p>
      {action}
    </div>
  )
}
