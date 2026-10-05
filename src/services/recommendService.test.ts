import { afterEach, describe, expect, it, vi } from 'vitest'
import { getRecommendedTitles } from './recommendService'

function jsonResponse(body: unknown, ok = true) {
  return {
    ok,
    json: async () => body,
  }
}

describe('getRecommendedTitles', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns titles on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({ titles: ['Amélie', 'Paddington'] }),
      ),
    )

    await expect(getRecommendedTitles('cozy')).resolves.toEqual([
      'Amélie',
      'Paddington',
    ])
  })

  it('throws the error message from an HTTP 429 JSON body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({ error: 'Too many requests. Please try again later.' }, false),
      ),
    )

    await expect(getRecommendedTitles('cozy')).rejects.toThrow(
      'Too many requests. Please try again later.',
    )
  })

  it('throws a readable error when the network request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    await expect(getRecommendedTitles('cozy')).rejects.toThrow(
      'Could not reach the recommendation service. Please check your connection.',
    )
  })

  it('throws when the JSON shape is invalid', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ titles: [1, 'Paddington'] })),
    )

    await expect(getRecommendedTitles('cozy')).rejects.toThrow(
      'The recommendation service returned an invalid movie list.',
    )
  })
})
