import { describe, it, expect, vi, afterEach } from 'vitest'
import { searchIngredients } from './index'

describe('searchIngredients', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls GET /ingredients with the search term', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    })
    vi.stubGlobal('fetch', mockFetch)

    await searchIngredients('cenoura')

    expect(mockFetch.mock.calls[0][0]).toContain('/ingredients?q=cenoura')
  })

  it('returns the parsed ingredients', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{ id: '1', name: 'Cenoura', status: 'approved' }]),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await searchIngredients('cenoura')

    expect(result).toEqual([{ id: '1', name: 'Cenoura', status: 'approved' }])
  })
})
