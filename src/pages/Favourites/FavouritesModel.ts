import {
  addFavourite,
  getFavourites,
  removeFavourite,
} from '../../services/firebaseService'
import type { Movie } from '../../types/movie'

export async function loadFavourites(userId: string): Promise<Movie[]> {
  return getFavourites(userId)
}

export async function saveFavourite(
  userId: string,
  movie: Movie,
): Promise<void> {
  return addFavourite(userId, movie)
}

export async function deleteFavourite(
  userId: string,
  imdbID: string,
): Promise<void> {
  return removeFavourite(userId, imdbID)
}
