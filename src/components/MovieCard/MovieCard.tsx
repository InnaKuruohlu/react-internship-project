import type { Movie } from '../../types/movie'
import './MovieCard.css'

type MovieCardProps = {
  movie: Movie
  favouriteLabel?: string
  onFavouriteClick?: () => void
}

function MovieCard({
  movie,
  favouriteLabel = 'Favourite',
  onFavouriteClick,
}: MovieCardProps) {
  return (
    <article className="movie-card">
      {movie.Poster !== 'N/A' ? (
        <img
          src={movie.Poster}
          alt={`${movie.Title} poster`}
          className="movie-card__poster"
        />
      ) : (
        <div className="movie-card__poster movie-card__poster--placeholder">
          No poster
        </div>
      )}

      <div className="movie-card__details">
        <h2 className="movie-card__title">{movie.Title}</h2>
        <p className="movie-card__meta">
          {movie.Year} · {movie.Type}
        </p>
        <button
          type="button"
          className="movie-card__favourite-button"
          onClick={onFavouriteClick}
        >
          {favouriteLabel}
        </button>
      </div>
    </article>
  )
}

export default MovieCard
