import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { IngredientList } from './IngredientList'
import type { RecipeIngredient } from '../../../types'

const INGREDIENTS: RecipeIngredient[] = [
  {
    ingredientId: 'i1',
    ingredientName: 'Cenoura',
    quantity: 2,
    unit: 'unidade',
    position: 0,
    isOptional: false,
  },
  {
    ingredientId: 'i2',
    ingredientName: 'Farinha',
    quantity: 1.5,
    unit: 'xicara',
    position: 1,
    isOptional: false,
  },
]

describe('IngredientList', () => {
  it('renders each ingredient name together with its quantity and unit', () => {
    render(<IngredientList ingredients={INGREDIENTS} originalPortions={4} currentPortions={4} />)

    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('Cenoura')).toBeInTheDocument()
    expect(within(items[0]).getByText('2 unidade')).toBeInTheDocument()
    expect(within(items[1]).getByText('Farinha')).toBeInTheDocument()
    expect(within(items[1]).getByText(/1[.,]5/)).toBeInTheDocument()
  })

  it('titles the list with a second-level heading', () => {
    render(<IngredientList ingredients={INGREDIENTS} originalPortions={4} currentPortions={4} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Ingredientes' })).toBeInTheDocument()
  })

  it('uses the locale decimal separator for fractional quantities', () => {
    render(<IngredientList ingredients={INGREDIENTS} originalPortions={4} currentPortions={4} />)

    expect(screen.getByText('1,5 xícara')).toBeInTheDocument()
  })

  it('still shows quantity and unit when the ingredient name is missing', () => {
    render(
      <IngredientList
        ingredients={[
          {
            ingredientId: 'i1',
            ingredientName: null,
            quantity: 2,
            unit: 'unidade',
            position: 0,
            isOptional: false,
          },
        ]}
        originalPortions={4}
        currentPortions={4}
      />,
    )

    expect(screen.getByText('2 unidade')).toBeInTheDocument()
  })

  it('shows an optional badge next to an optional ingredient', () => {
    render(
      <IngredientList
        ingredients={[
          {
            ingredientId: 'i1',
            ingredientName: 'Cenoura',
            quantity: 2,
            unit: 'unidade',
            position: 0,
            isOptional: false,
          },
          {
            ingredientId: 'i2',
            ingredientName: 'Farinha',
            quantity: 1,
            unit: 'xicara',
            position: 1,
            isOptional: true,
          },
        ]}
        originalPortions={4}
        currentPortions={4}
      />,
    )

    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).queryByText('opcional')).not.toBeInTheDocument()
    expect(within(items[1]).getByText('opcional')).toBeInTheDocument()
  })
})
