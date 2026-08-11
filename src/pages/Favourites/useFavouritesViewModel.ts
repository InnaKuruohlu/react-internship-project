import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { deleteFavourite, loadFavourites } from './FavouritesModel'
import type { Movie } from '../../types/movie'

export function useFavouritesViewModel() {
  const { user } = useAuth()
  const [favourites, setFavourites] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMovies = useCallback(async () => {
    if (!user?.uid) {
      setFavourites([])
      setError('You must be signed in to view favourites.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const movies = await loadFavourites(user.uid)
      setFavourites(movies)
    } catch (err) {
      setFavourites([])
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }, [user?.uid])

  async function removeMovie(imdbID: string) {
    if (!user?.uid) {
      setError('You must be signed in to remove favourites.')
      return
    }

    setError(null)

    try {
      await deleteFavourite(user.uid, imdbID)
      setFavourites((currentFavourites) =>
        currentFavourites.filter((movie) => movie.imdbID !== imdbID),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  useEffect(() => {
    void loadMovies()
  }, [loadMovies])

  return {
    favourites,
    loading,
    error,
    loadMovies,
    removeMovie,
  }
}
