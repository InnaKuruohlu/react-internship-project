import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Movie } from '../../types/movie'
import { searchMovies } from '../../services/omdbMovieService'
import { getRecommendedTitles } from '../../services/recommendService'
import { getMoviesByMood } from './HomeModel'

vi.mock('../../services/recommendService', () => ({
  getRecommendedTitles: vi.fn(),
}))

vi.mock('../../services/omdbMovieService', () => ({
  searchMovies: vi.fn(),
}))

function movie(title: string, imdbID: string): Movie {
  return {
    Title: title,
    Year: '2008',
    imdbID,
    Type: 'movie',
    Poster: 'N/A',
  }
}

describe('getMoviesByMood', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('rejects moods shorter than 3 characters', async () => {
    await expect(getMoviesByMood('ab')).rejects.toThrow(
      'Mood must be at least 3 characters.',
    )
    await expect(getMoviesByMood('  yo ')).rejects.toThrow(
      'Mood must be at least 3 characters.',
    )

    expect(getRecommendedTitles).not.toHaveBeenCalled()
    expect(searchMovies).not.toHaveBeenCalled()
  })

  it('removes duplicate imdbIDs', async () => {
    vi.mocked(getRecommendedTitles).mockResolvedValue([
      'Batman',
      'The Dark Knight',
    ])
    vi.mocked(searchMovies).mockImplementation(async (title) => [
      movie(title, 'tt0468569'),
    ])

    await expect(getMoviesByMood('brooding')).resolves.toEqual([
      movie('The Dark Knight', 'tt0468569'),
    ])
  })

  it('ignores titles whose search fails', async () => {
    vi.mocked(getRecommendedTitles).mockResolvedValue(['Unknown', 'Inception'])
    vi.mocked(searchMovies).mockImplementation(async (title) => {
      if (title === 'Unknown') {
        throw new Error('not found')
      }

      return [movie('Inception', 'tt1375666')]
    })

    await expect(getMoviesByMood('mind-bending')).resolves.toEqual([
      movie('Inception', 'tt1375666'),
    ])
  })

  it('throws when nothing is found', async () => {
    vi.mocked(getRecommendedTitles).mockResolvedValue(['Unknown', 'Missing'])
    vi.mocked(searchMovies).mockRejectedValue(new Error('not found'))

    await expect(getMoviesByMood('bleak')).rejects.toThrow(
      'No movies found for that mood.',
    )
  })
})
