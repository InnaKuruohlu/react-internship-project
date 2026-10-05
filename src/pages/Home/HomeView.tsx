import { useEffect } from 'react'
import MovieCard from '../../components/MovieCard/MovieCard'
import { useHomeViewModel } from './useHomeViewModel.tsx'
import './HomeView.css'

function HomeView() {
  const {
    movies,
    loading,
    error,
    loadInitialMovies,
    handleFavouriteClick,
    mood,
    setMood,
    moodMovies,
    moodStatus,
    moodError,
    submittedMood,
    submitMood,
  } = useHomeViewModel()

  useEffect(() => {
    void loadInitialMovies()
  }, [loadInitialMovies])

  function onMoodSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submitMood()
  }

  return (
    <main className="home">
      <form className="home__mood" onSubmit={onMoodSubmit}>
        <label className="home__mood-label" htmlFor="home-mood">
          Describe what you want to watch
        </label>
        <textarea
          id="home-mood"
          className="home__mood-input"
          value={mood}
          onChange={(event) => setMood(event.target.value)}
          maxLength={200}
          rows={3}
          aria-describedby="home-mood-note"
        />
        <p id="home-mood-note" className="home__mood-note">
          Don't enter personal information. Your text is processed by Google
          Gemini.
        </p>
        <button
          type="submit"
          className="home__mood-submit"
          disabled={moodStatus === 'loading'}
        >
          Find by mood
        </button>
      </form>

      <p className="home__message home__mood-status" aria-live="polite">
        {moodStatus === 'loading' ? 'Finding movies...' : ''}
      </p>

      {moodError && (
        <p className="home__message home__message--error" role="alert">
          {moodError}
        </p>
      )}

      {moodStatus === 'success' && moodMovies.length > 0 && (
        <section className="home__mood-results">
          <h2 className="home__mood-heading">
            Recommendations for: {submittedMood}
          </h2>
          <ul className="home__movie-list">
            {moodMovies.map((movie) => (
              <li key={movie.imdbID}>
                <MovieCard
                  movie={movie}
                  onFavouriteClick={() => handleFavouriteClick(movie)}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {moodStatus === 'success' && moodMovies.length === 0 && (
        <p className="home__message">No movies found for that mood.</p>
      )}

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
