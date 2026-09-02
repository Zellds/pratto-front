import { describe, it, expect, vi, afterEach } from 'vitest'
import { getFeed, getRecipe, createRecipe, updateRecipe, publishRecipe, rateRecipe } from './index'
import type { RecipePayload } from '../types'

describe('getFeed', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls GET /feed and returns the parsed recipes', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    })
    vi.stubGlobal('fetch', mockFetch)

    await getFeed()

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/feed'),
      expect.objectContaining({ headers: expect.any(Object) }),
    )
  })

  it('includes the page query param when given', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    })
    vi.stubGlobal('fetch', mockFetch)

    await getFeed(2)

    expect(mockFetch.mock.calls[0][0]).toContain('page=2')
  })

  it('passes the token through for authorization', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    })
    vi.stubGlobal('fetch', mockFetch)

    await getFeed(undefined, 'abc123')

    const [, requestInit] = mockFetch.mock.calls[0]
    expect(requestInit.headers.Authorization).toBe('Bearer abc123')
  })
})

const SAMPLE_PAYLOAD: RecipePayload = {
  title: 'Bolo de cenoura',
  description: 'Bolo simples e rápido',
  portions: 8,
  prep_time_minutes: 60,
  ingredients: [{ ingredient_name: 'Cenoura', quantity: 3, unit: 'unidade', position: 0 }],
  steps: [{ position: 0, instruction: 'Bata tudo no liquidificador.' }],
}

describe('getRecipe', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls GET /recipes/:id and returns the parsed recipe', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: '1' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await getRecipe('1')

    expect(mockFetch.mock.calls[0][0]).toContain('/recipes/1')
  })

  it('includes the portions query param when given', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: '1' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await getRecipe('1', 8)

    expect(mockFetch.mock.calls[0][0]).toContain('portions=8')
  })
})

describe('createRecipe', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls POST /recipes with the payload and token', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ id: '1' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await createRecipe(SAMPLE_PAYLOAD, 'tok123')

    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toContain('/recipes')
    expect(init.method).toBe('POST')
    expect(init.headers.Authorization).toBe('Bearer tok123')
    expect(JSON.parse(init.body)).toEqual(SAMPLE_PAYLOAD)
  })
})

describe('updateRecipe', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls PATCH /recipes/:id with the payload and token', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: '1' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await updateRecipe('1', SAMPLE_PAYLOAD, 'tok123')

    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toContain('/recipes/1')
    expect(init.method).toBe('PATCH')
    expect(init.headers.Authorization).toBe('Bearer tok123')
  })
})

describe('publishRecipe', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls POST /recipes/:id/publish with the token', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: '1' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await publishRecipe('1', 'tok123')

    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toContain('/recipes/1/publish')
    expect(init.method).toBe('POST')
    expect(init.headers.Authorization).toBe('Bearer tok123')
  })
})

describe('rateRecipe', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls PUT /recipes/:id/rating with the score and token', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 'r1', recipeId: '1', userId: 'u1', score: 4.5 }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await rateRecipe('1', 4.5, 'tok123')

    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toContain('/recipes/1/rating')
    expect(init.method).toBe('PUT')
    expect(init.headers.Authorization).toBe('Bearer tok123')
    expect(JSON.parse(init.body)).toEqual({ score: 4.5 })
  })
})
