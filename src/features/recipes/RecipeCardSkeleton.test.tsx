import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RecipeCardSkeleton } from './RecipeCardSkeleton'

describe('RecipeCardSkeleton', () => {
  it('renders as a decorative, non-interactive placeholder', () => {
    const { container } = render(<RecipeCardSkeleton />)

    const root = container.querySelector('.recipe-card-skeleton')
    expect(root).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0)
  })
})
