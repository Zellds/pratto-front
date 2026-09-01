// src/shared/api/client.test.ts

import { describe, it, expect, vi, afterEach } from 'vitest'
import { apiFetch, ApiError } from './client'

describe('apiFetch', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('builds the URL from VITE_API_URL and returns the parsed JSON body', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: '1' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await apiFetch<{ id: string }>('/recipes')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/recipes'),
      expect.objectContaining({ headers: expect.any(Object) }),
    )
    expect(result).toEqual({ id: '1' })
  })

  it('injects the Authorization header when a token is given', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    })
    vi.stubGlobal('fetch', mockFetch)

    await apiFetch('/me', { token: 'abc123' })

    const [, requestInit] = mockFetch.mock.calls[0]
    expect(requestInit.headers.Authorization).toBe('Bearer abc123')
  })

  it('throws ApiError on a non-2xx response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'Not found' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await expect(apiFetch('/recipes/999')).rejects.toThrow(ApiError)
  })

  it('falls back to a generic message when the error response body is not valid JSON', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: () => Promise.reject(new SyntaxError('Unexpected token <')),
    })
    vi.stubGlobal('fetch', mockFetch)

    await expect(apiFetch('/recipes')).rejects.toBeInstanceOf(ApiError)
  })
})
