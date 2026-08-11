import type { Movie, OmdbSearchResponse } from '../types/movie'

const API_URL = 'https://www.omdbapi.com/'

export async function searchMovies(query: string): Promise<Movie[]> {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY?.trim()

  if (!apiKey) {
    throw new Error(
      'OMDb API key is not configured. Set VITE_OMDB_API_KEY in your environment.',
    )
  }

  const url = `${API_URL}?apikey=${encodeURIComponent(apiKey)}&s=${encodeURIComponent(query)}`
  console.log('[OMDb] Searching for:', query)

  const response = await fetch(url)
  const data: OmdbSearchResponse = await response.json()
  console.log('[OMDb] Response:', data)

  if (!response.ok) {
    console.error('[OMDb] HTTP error:', response.status, response.statusText)
    throw new Error(
      data.Error ?? `OMDb request failed with status ${response.status}.`,
    )
  }

  if (data.Response === 'False') {
    console.error('[OMDb] API error:', data.Error)
    throw new Error(data.Error ?? 'OMDb returned an unsuccessful response.')
  }

  const movies = data.Search ?? []
  console.log('[OMDb] Movies found:', movies.length, movies)

  return movies
}
