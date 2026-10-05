import { searchMovies } from '../../services/omdbMovieService'
import { getRecommendedTitles } from '../../services/recommendService'
import type { Movie } from '../../types/movie'

const SEED_KEYWORDS = [
  'Batman',
  'Avengers',
  'Harry Potter',
  'Star Wars',
  'Spider-Man',
  'Marvel',
  'Disney',
  'Matrix',
  'Lord of the Rings',
  'Fast',
  'Mission Impossible',
  'Pixar',
  'Horror',
  'Comedy',
  'Action',
]

const TARGET_MOVIE_COUNT = 20
const KEYWORD_BATCH_SIZE = 3

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items]

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

export async function getMovies(query: string): Promise<Movie[]> {
  const cleanedQuery = query.trim()

  if (cleanedQuery.length < 2) {
    throw new Error('Search query must be at least 2 characters.')
  }

  return searchMovies(cleanedQuery)
}

export async function getMoviesByMood(mood: string): Promise<Movie[]> {
  const cleanedMood = mood.trim()

  if (cleanedMood.length < 3) {
    throw new Error('Mood must be at least 3 characters.')
  }

  const titles = await getRecommendedTitles(cleanedMood)
  const results = await Promise.all(
    titles.map(async (title) => {
      try {
        const movies = await searchMovies(title)
        return movies[0]
      } catch {
        return undefined
      }
    }),
  )

  const uniqueMovies = new Map<string, Movie>()
  for (const movie of results) {
    if (movie) {
      uniqueMovies.set(movie.imdbID, movie)
    }
  }

  if (uniqueMovies.size === 0) {
    throw new Error('No movies found for that mood.')
  }

  return [...uniqueMovies.values()]
}

export async function initialMovies(): Promise<Movie[]> {
  const uniqueMovies = new Map<string, Movie>()
  const shuffledKeywords = shuffle(SEED_KEYWORDS)
  let keywordIndex = 0

  while (
    uniqueMovies.size < TARGET_MOVIE_COUNT &&
    keywordIndex < shuffledKeywords.length
  ) {
    const keywordBatch = shuffledKeywords.slice(
      keywordIndex,
      keywordIndex + KEYWORD_BATCH_SIZE,
    )
    keywordIndex += KEYWORD_BATCH_SIZE

    const batchResults = await Promise.all(
      keywordBatch.map(async (keyword) => {
        try {
          return await searchMovies(keyword)
        } catch {
          return []
        }
      }),
    )

    for (const movie of batchResults.flat()) {
      uniqueMovies.set(movie.imdbID, movie)
    }
  }

  return shuffle([...uniqueMovies.values()]).slice(0, TARGET_MOVIE_COUNT)
}
