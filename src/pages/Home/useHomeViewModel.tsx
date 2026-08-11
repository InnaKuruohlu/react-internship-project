import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { saveFavourite } from '../Favourites/FavouritesModel'
import { getMovies, initialMovies } from './HomeModel'
import type { Movie } from '../../types/movie'

type HomeViewModel = {
  query: string
  setQuery: (query: string) => void
  movies: Movie[]
  loading: boolean
  error: string | null
  handleSearch: () => Promise<void>
  loadInitialMovies: () => Promise<void>
  handleFavouriteClick: (movie: Movie) => void
}

const HomeViewModelContext = createContext<HomeViewModel | null>(null)

export function HomeViewModelProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  const loadInitialMovies = useCallback(async () => {
    const requestId = ++requestIdRef.current
    setLoading(true)
    setError(null)

    try {
      const results = await initialMovies()

      if (requestId !== requestIdRef.current) {
        return
      }

      setMovies(results)
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return
      }

      setMovies([])
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false)
      }
    }
  }, [])

  async function handleSearch() {
    const requestId = ++requestIdRef.current
    setLoading(true)
    setError(null)

    try {
      const results = await getMovies(query)

      if (requestId !== requestIdRef.current) {
        return
      }

      setMovies(results)
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return
      }

      setMovies([])
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false)
      }
    }
  }

  async function onFavourite(movie: Movie) {
    if (!user?.uid) {
      setError('You must be signed in to add favourites.')
      return
    }

    setError(null)

    try {
      await saveFavourite(user.uid, movie)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  function handleFavouriteClick(movie: Movie) {
    if (!user) {
      navigate('/favourites')
      return
    }

    void onFavourite(movie)
  }

  return (
    <HomeViewModelContext.Provider
      value={{
        query,
        setQuery,
        movies,
        loading,
        error,
        handleSearch,
        loadInitialMovies,
        handleFavouriteClick,
      }}
    >
      {children}
    </HomeViewModelContext.Provider>
  )
}

export function useHomeViewModel(): HomeViewModel {
  const context = useContext(HomeViewModelContext)

  if (!context) {
    throw new Error('useHomeViewModel must be used within HomeViewModelProvider')
  }

  return context
}
