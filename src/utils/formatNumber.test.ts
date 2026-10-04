import { describe, it, expect } from 'vitest'
import { formatNumber } from './formatNumber'

describe('formatNumber', () => {
  it('uses a decimal comma in pt-BR and a decimal point in en', () => {
    expect(formatNumber(4.5, 'pt-BR', 1)).toBe('4,5')
    expect(formatNumber(4.5, 'en', 1)).toBe('4.5')
  })

  it('rounds to the maximum fraction digits without trailing zeros', () => {
    expect(formatNumber(3.375, 'pt-BR', 2)).toBe('3,38')
    expect(formatNumber(4.04, 'en', 1)).toBe('4')
    expect(formatNumber(3, 'pt-BR', 2)).toBe('3')
  })
})
