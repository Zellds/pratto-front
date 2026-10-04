import { describe, it, expect } from 'vitest'
import i18n from '../config/i18n'
import { formatDuration } from './formatDuration'

describe('formatDuration', () => {
  it.each([
    [0, '0 min'],
    [45, '45 min'],
    [60, '1 h'],
    [120, '2 h'],
    [65, '1h05'],
    [105, '1h45'],
  ])('formats %i minutes as %s', (totalMinutes, expected) => {
    expect(formatDuration(totalMinutes, i18n.t)).toBe(expected)
  })
})
