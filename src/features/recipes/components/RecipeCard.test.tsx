import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { RecipeCard } from './RecipeCard'
import type { Recipe } from '../types'

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

function renderCard(recipe: Recipe = baseRecipe, rank?: number) {
  return render(
    <MemoryRouter>
      <RecipeCard recipe={recipe} rank={rank} />
    </MemoryRouter>,
  )
}

describe('RecipeCard', () => {
  it('renders the title and prep time', () => {
    renderCard()

    expect(screen.getByText('Bolo de cenoura')).toBeInTheDocument()
    expect(screen.getByText('60 min de preparo')).toBeInTheDocument()
  })

  it('links the title to the recipe detail page', () => {
    renderCard()

    expect(screen.getByRole('link', { name: 'Bolo de cenoura' })).toHaveAttribute(
      'href',
      '/receitas/1',
    )
  })

  it('shows "no ratings yet" when averageRating is null', () => {
    renderCard()

    expect(screen.getByText('Sem avaliações ainda')).toBeInTheDocument()
  })

  it('shows the average rating when present', () => {
    renderCard({ ...baseRecipe, averageRating: 4.5, ratingsCount: 2 })

    expect(screen.getByText('★ 4.5')).toBeInTheDocument()
  })

  it('shows a pending-review badge when the recipe is not yet approved', () => {
    renderCard({ ...baseRecipe, status: 'pending_review' })

    expect(screen.getByText('Em revisão')).toBeInTheDocument()
  })

  it('does not show a pending-review badge for a published recipe', () => {
    renderCard()

    expect(screen.queryByText('Em revisão')).not.toBeInTheDocument()
  })

  it('renders the cover photo when coverThumbnailUrl is present', () => {
    renderCard({ ...baseRecipe, coverThumbnailUrl: 'https://example.com/thumb.jpg' })

    expect(screen.getByRole('img', { name: 'Bolo de cenoura' })).toHaveAttribute(
      'src',
      'https://example.com/thumb.jpg',
    )
  })

  it('shows a placeholder when there is no cover photo', () => {
    renderCard()

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('shows the author byline when the owner display name is known', () => {
    renderCard({ ...baseRecipe, ownerDisplayName: 'Marina Alves' })

    expect(screen.getByText('por Marina Alves')).toBeInTheDocument()
  })

  it('shows a rank badge and a disabled save button when rank is given', () => {
    renderCard(baseRecipe, 2)

    expect(screen.getByText('#2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled()
  })

  it('does not show a rank badge or save button without a rank', () => {
    renderCard()

    expect(screen.queryByText(/^#\d+$/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Salvar' })).not.toBeInTheDocument()
  })
})
