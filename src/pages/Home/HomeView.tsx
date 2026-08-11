import { useEffect } from 'react'
import MovieCard from '../../components/MovieCard/MovieCard'
import { useHomeViewModel } from './useHomeViewModel.tsx'
import './HomeView.css'

function HomeView() {
  const { movies, loading, error, loadInitialMovies, handleFavouriteClick } =
    useHomeViewModel()

  useEffect(() => {
    void loadInitialMovies()
  }, [loadInitialMovies])

  return (
    <main className="home">
      {loading && <p className="home__message">Loading...</p>}
      {error && <p className="home__message home__message--error">{error}</p>}

      <ul className="home__movie-list">
        {movies.map((movie) => (
          <li key={movie.imdbID}>
            <MovieCard
              movie={movie}
              onFavouriteClick={() => handleFavouriteClick(movie)}
            />
          </li>
        ))}
      </ul>
    </main>
  )
}

export default HomeView
