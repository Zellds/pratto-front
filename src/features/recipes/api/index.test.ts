import { describe, it, expect, vi, afterEach } from 'vitest'
import { getFeed } from './index'

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
