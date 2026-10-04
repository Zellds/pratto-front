import type { ReactNode } from 'react'
import './PrepPaper.css'

export function PrepPaper({ children }: { children: ReactNode }) {
  return (
    <div className="prep-paper">
      <span className="prep-paper-tape" aria-hidden="true" />
      {children}
    </div>
  )
}
