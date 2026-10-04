import type { ReactNode } from 'react'
import { PaperSheet } from '@/components/PaperSheet/PaperSheet'
import './PrepPaper.css'

export function PrepPaper({ children }: { children: ReactNode }) {
  return <PaperSheet className="prep-paper">{children}</PaperSheet>
}
