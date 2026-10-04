import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import './PaperSheet.css'

type PaperSheetProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  as?: 'div' | 'section'
  children: ReactNode
}

export function PaperSheet({
  as: Element = 'div',
  className,
  children,
  ...elementProps
}: PaperSheetProps) {
  const classes = className ? `paper-sheet ${className}` : 'paper-sheet'

  return (
    <Element className={classes} {...elementProps}>
      <span className="paper-sheet-tape" aria-hidden="true" />
      {children}
    </Element>
  )
}
