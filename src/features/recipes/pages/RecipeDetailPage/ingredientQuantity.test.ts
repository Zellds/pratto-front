import { describe, it, expect } from 'vitest'
import i18n from '@/config/i18n'
import type { RecipeIngredient } from '../../types'
import { formatIngredientQuantity, scaleIngredients } from './ingredientQuantity'

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

describe('formatIngredientQuantity', () => {
  it('joins the quantity with the translated unit, using the locale decimal separator', () => {
    expect(formatIngredientQuantity(INGREDIENTS[1], i18n.t, 'pt-BR')).toBe('1,5 xícara')
    expect(formatIngredientQuantity(INGREDIENTS[0], i18n.t, 'pt-BR')).toBe('2 unidade')
  })

  it('keeps a decimal point in English', () => {
    expect(formatIngredientQuantity(INGREDIENTS[1], i18n.t, 'en')).toMatch(/^1\.5 /)
  })
})
