import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Hero } from './Hero'
import type { Recipe } from './types'

const recipe: Recipe = {
  id: '1',
  ownerId: 'owner-1',
  ownerUsername: 'marina',
  ownerDisplayName: 'Marina Alves',
  title: 'Risoto de cogumelos',
  description: 'Cremoso e pronto em 40 minutos.',
  portions: 4,
  prepTimeMinutes: 40,
  status: 'published',
  coverMediaId: null,
  coverThumbnailUrl: null,
  coverDisplayUrl: null,
  rejectionReason: null,
  averageRating: 4.9,
  ratingsCount: 312,
  ingredients: [],
  steps: [],
}

function renderHero() {
  return render(
    <MemoryRouter>
      <Hero recipe={recipe} />
    </MemoryRouter>,
  )
}

describe('Hero', () => {
  it('renders the recipe title, description and author', () => {
    renderHero()

    expect(screen.getByRole('heading', { name: 'Risoto de cogumelos' })).toBeInTheDocument()
    expect(screen.getByText('Cremoso e pronto em 40 minutos.')).toBeInTheDocument()
    expect(screen.getByText('por Marina Alves')).toBeInTheDocument()
  })

  it('shows prep time, portions and rating', () => {
    renderHero()

    expect(screen.getByText('40 min de preparo')).toBeInTheDocument()
    expect(screen.getByText('4 porções')).toBeInTheDocument()
    expect(screen.getByText('Nota 4.9')).toBeInTheDocument()
  })

  it('links "Ver receita" to the recipe detail page', () => {
    renderHero()

    expect(screen.getByRole('link', { name: 'Ver receita' })).toHaveAttribute('href', '/receitas/1')
  })

  it('has a disabled save button (no favorites feature yet)', () => {
    renderHero()

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled()
  })
})
