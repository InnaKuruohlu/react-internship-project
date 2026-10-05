import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Movie } from '../../types/movie'
import MovieCard from './MovieCard'

const movie: Movie = {
  Title: 'Inception',
  Year: '2010',
  imdbID: 'tt1375666',
  Type: 'movie',
  Poster: 'https://example.com/inception.jpg',
}

describe('MovieCard', () => {
  it('renders the title and year', () => {
    render(<MovieCard movie={movie} />)

    expect(screen.getByRole('heading', { name: 'Inception' })).toBeInTheDocument()
    expect(screen.getByText('2010 · movie')).toBeInTheDocument()
  })

  it('calls onFavouriteClick when the favourite button is clicked', async () => {
    const user = userEvent.setup()
    const onFavouriteClick = vi.fn()

    render(<MovieCard movie={movie} onFavouriteClick={onFavouriteClick} />)
    await user.click(screen.getByRole('button', { name: 'Favourite' }))

    expect(onFavouriteClick).toHaveBeenCalledOnce()
  })

  it("handles a movie with Poster: 'N/A' without crashing", () => {
    render(<MovieCard movie={{ ...movie, Poster: 'N/A' }} />)

    expect(screen.getByText('No poster')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
