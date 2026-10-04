import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecipeHero } from './RecipeHero'

describe('RecipeHero', () => {
  it('shows the recipe title as the main heading', () => {
    render(<RecipeHero title="Bolo de cenoura" coverUrl={null} />)

    expect(screen.getByRole('heading', { level: 1, name: 'Bolo de cenoura' })).toBeInTheDocument()
  })

  it('shows the cover image when there is one', () => {
    const { container } = render(
      <RecipeHero title="Bolo de cenoura" coverUrl="https://example.com/cover.jpg" />,
    )

    expect(container.querySelector('img')).toHaveAttribute('src', 'https://example.com/cover.jpg')
  })

  it('shows no image when the recipe has no cover', () => {
    const { container } = render(<RecipeHero title="Bolo de cenoura" coverUrl={null} />)

    expect(container.querySelector('img')).not.toBeInTheDocument()
  })
})
