import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { DiscoverSection } from './DiscoverSection'
import type { Recipe } from './types'

const recipe: Recipe = {
  id: '1',
  ownerId: 'owner-1',
  ownerUsername: null,
  ownerDisplayName: null,
  title: 'Omelete de forno',
  description: '',
  portions: 2,
  prepTimeMinutes: 25,
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

function renderSection(recipes: Recipe[] = [recipe]) {
  return render(
    <MemoryRouter>
      <DiscoverSection recipes={recipes} />
    </MemoryRouter>,
  )
}

describe('DiscoverSection', () => {
  it('renders the section title and the given recipes', () => {
    renderSection()

    expect(screen.getByRole('heading', { name: 'Descubra' })).toBeInTheDocument()
    expect(screen.getByText('Omelete de forno')).toBeInTheDocument()
  })

  it('shows a disabled "coming soon" badge instead of a real ingredient match', () => {
    renderSection()

    expect(screen.getAllByText('Em breve').length).toBeGreaterThan(0)
  })
})
