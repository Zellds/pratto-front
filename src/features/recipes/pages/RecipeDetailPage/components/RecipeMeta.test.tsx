import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import type { Recipe } from '../../../types'
import { RecipeMeta } from './RecipeMeta'

const RECIPE: Recipe = {
  id: '1',
  ownerId: 'o1',
  ownerUsername: 'gabriel',
  ownerDisplayName: 'Gabriel Medeiros',
  title: 'Bolo de cenoura',
  description: 'Bolo simples',
  portions: 8,
  prepTimeMinutes: 105,
  status: 'published',
  coverMediaId: null,
  coverThumbnailUrl: null,
  coverDisplayUrl: null,
  rejectionReason: null,
  averageRating: 4.5,
  ratingsCount: 12,
  ingredients: [],
  steps: [{ position: 0, instruction: 'Bata tudo.' }],
}

function renderMeta(recipe: Recipe, isOwner = false, onStartCooking = vi.fn()) {
  return render(
    <MemoryRouter>
      <RecipeMeta recipe={recipe} isOwner={isOwner} onStartCooking={onStartCooking} />
    </MemoryRouter>,
  )
}

describe('RecipeMeta', () => {
  it('shows the author name and username', () => {
    renderMeta(RECIPE)

    expect(screen.getByText('Gabriel Medeiros')).toBeInTheDocument()
    expect(screen.getByText('@gabriel')).toBeInTheDocument()
  })

  it('shows the average rating and the ratings count', () => {
    renderMeta(RECIPE)

    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('(12)')).toBeInTheDocument()
  })

  it('says there are no ratings when the average is null', () => {
    renderMeta({ ...RECIPE, averageRating: null, ratingsCount: 0 })

    expect(screen.getByText(/Sem avaliações/)).toBeInTheDocument()
  })

  it('shows the preparation time formatted as hours and minutes', () => {
    renderMeta(RECIPE)

    expect(screen.getByText('1h45')).toBeInTheDocument()
  })

  it('shows the edit link only to the owner', () => {
    const { unmount } = renderMeta(RECIPE, true)
    expect(screen.getByRole('link', { name: 'Editar' })).toHaveAttribute(
      'href',
      '/receitas/1/editar',
    )
    unmount()

    renderMeta(RECIPE, false)
    expect(screen.queryByRole('link', { name: 'Editar' })).not.toBeInTheDocument()
  })

  it('starts cooking when the start button is clicked', async () => {
    const onStartCooking = vi.fn()
    renderMeta(RECIPE, false, onStartCooking)

    await userEvent.click(screen.getByRole('button', { name: 'Iniciar preparo' }))

    expect(onStartCooking).toHaveBeenCalledTimes(1)
  })

  it('hides the start button when the recipe has no steps', () => {
    renderMeta({ ...RECIPE, steps: [] })

    expect(screen.queryByRole('button', { name: 'Iniciar preparo' })).not.toBeInTheDocument()
  })
})
