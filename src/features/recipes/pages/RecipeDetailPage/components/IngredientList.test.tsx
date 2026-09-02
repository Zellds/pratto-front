import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IngredientList, scaleIngredients } from './IngredientList'
import type { RecipeIngredient } from '../../../types'

const INGREDIENTS: RecipeIngredient[] = [
  { ingredientId: 'i1', quantity: 2, unit: 'unidade', position: 0 },
  { ingredientId: 'i2', quantity: 1.5, unit: 'xicara', position: 1 },
]

describe('scaleIngredients', () => {
  it('returns the same quantities when target equals original portions', () => {
    expect(scaleIngredients(INGREDIENTS, 4, 4)).toEqual(INGREDIENTS)
  })

  it('scales each quantity proportionally, rounded to 2 decimals', () => {
    const result = scaleIngredients(INGREDIENTS, 4, 8)
    expect(result[0].quantity).toBe(4)
    expect(result[1].quantity).toBe(3)
  })

  it('handles a non-integer ratio without floating point noise', () => {
    const result = scaleIngredients(INGREDIENTS, 4, 3)
    expect(result[0].quantity).toBe(1.5)
    expect(result[1].quantity).toBe(1.13)
  })
})

describe('IngredientList', () => {
  it('renders each ingredient quantity and unit', () => {
    render(<IngredientList ingredients={INGREDIENTS} originalPortions={4} currentPortions={4} />)

    expect(screen.getByText(/2/)).toBeInTheDocument()
    expect(screen.getByText(/1[.,]5/)).toBeInTheDocument()
  })
})
