import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  get,
  getDatabase,
  ref,
  remove,
  set,
} from 'firebase/database'
import { getFirestore } from 'firebase/firestore'
import type { Movie } from '../types/movie'

const FAVOURITES_COLLECTION = 'favourites'

function getFavouritePath(userId: string, imdbID?: string) {
  const basePath = `users/${userId}/${FAVOURITES_COLLECTION}`
  return imdbID ? `${basePath}/${imdbID}` : basePath
}

function requireUserId(userId: string, action: string) {
  if (!userId.trim()) {
    throw new Error(`Failed to ${action}: userId is required.`)
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

const realtimeDatabase = getDatabase(app)

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred.'
}

function toMovie(data: unknown): Movie | null {
  if (
    typeof data === 'object' &&
    data !== null &&
    'Title' in data &&
    'Year' in data &&
    'imdbID' in data &&
    'Type' in data &&
    'Poster' in data &&
    typeof data.Title === 'string' &&
    typeof data.Year === 'string' &&
    typeof data.imdbID === 'string' &&
    typeof data.Type === 'string' &&
    typeof data.Poster === 'string'
  ) {
    return {
      Title: data.Title,
      Year: data.Year,
      imdbID: data.imdbID,
      Type: data.Type,
      Poster: data.Poster,
    }
  }

  return null
}

export async function addFavourite(
  userId: string,
  movie: Movie,
): Promise<void> {
  requireUserId(userId, 'add favourite')

  if (!movie.imdbID) {
    throw new Error('Failed to add favourite: movie imdbID is required.')
  }

  try {
    await set(
      ref(realtimeDatabase, getFavouritePath(userId, movie.imdbID)),
      movie,
    )
  } catch (error) {
    throw new Error(`Failed to add favourite: ${getErrorMessage(error)}`)
  }
}

export async function removeFavourite(
  userId: string,
  imdbID: string,
): Promise<void> {
  requireUserId(userId, 'remove favourite')

  if (!imdbID) {
    throw new Error('Failed to remove favourite: imdbID is required.')
  }

  try {
    await remove(ref(realtimeDatabase, getFavouritePath(userId, imdbID)))
  } catch (error) {
    throw new Error(`Failed to remove favourite: ${getErrorMessage(error)}`)
  }
}

export async function getFavourites(userId: string): Promise<Movie[]> {
  requireUserId(userId, 'load favourites')

  try {
    const snapshot = await get(ref(realtimeDatabase, getFavouritePath(userId)))

    if (!snapshot.exists()) {
      return []
    }

    const value = snapshot.val() as Record<string, unknown>

    return Object.values(value).flatMap((entry) => {
      const movie = toMovie(entry)

      if (!movie) {
        return []
      }

      return [movie]
    })
  } catch (error) {
    throw new Error(`Failed to load favourites: ${getErrorMessage(error)}`)
  }
}
