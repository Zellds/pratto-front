import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { HeroSkeleton } from './HeroSkeleton'

describe('HeroSkeleton', () => {
  it('renders as a decorative, non-interactive placeholder', () => {
    const { container } = render(<HeroSkeleton />)

    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0)
  })
})
