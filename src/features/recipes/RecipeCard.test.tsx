import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecipeCard } from './RecipeCard'
import type { Recipe } from './types'

const baseRecipe: Recipe = {
  id: '1',
  ownerId: 'owner-1',
  ownerUsername: null,
  ownerDisplayName: null,
  title: 'Bolo de cenoura',
  description: 'Bolo simples e rápido',
  portions: 8,
  prepTimeMinutes: 60,
  status: 'published',
  coverMediaId: null,
  coverThumbnailUrl: null,
  coverDisplayUrl: null,
  rejectionReason: null,
  averageRating: null,
  ratingsCount: 0,
  ingredients: [],
  steps: [],
}

describe('RecipeCard', () => {
  it('renders the title and prep time', () => {
    render(<RecipeCard recipe={baseRecipe} />)

    expect(screen.getByText('Bolo de cenoura')).toBeInTheDocument()
    expect(screen.getByText('60 min de preparo')).toBeInTheDocument()
  })

  it('shows "no ratings yet" when averageRating is null', () => {
    render(<RecipeCard recipe={baseRecipe} />)

    expect(screen.getByText('Sem avaliações ainda')).toBeInTheDocument()
  })

  it('shows the average rating when present', () => {
    render(<RecipeCard recipe={{ ...baseRecipe, averageRating: 4.5, ratingsCount: 2 }} />)

    expect(screen.getByText('Nota 4.5')).toBeInTheDocument()
  })

  it('shows a pending-review badge when the recipe is not yet approved', () => {
    render(<RecipeCard recipe={{ ...baseRecipe, status: 'pending_review' }} />)

    expect(screen.getByText('Em revisão')).toBeInTheDocument()
  })

  it('does not show a pending-review badge for a published recipe', () => {
    render(<RecipeCard recipe={baseRecipe} />)

    expect(screen.queryByText('Em revisão')).not.toBeInTheDocument()
  })
})
