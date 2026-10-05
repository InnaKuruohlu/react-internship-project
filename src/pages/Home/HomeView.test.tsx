import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Movie } from '../../types/movie'
import HomeView from './HomeView'
import { useHomeViewModel } from './useHomeViewModel.tsx'

vi.mock('./useHomeViewModel.tsx', () => ({
  useHomeViewModel: vi.fn(),
}))

function movie(title: string): Movie {
  return {
    Title: title,
    Year: '2001',
    imdbID: title,
    Type: 'movie',
    Poster: 'N/A',
  }
}

function renderHome(
  overrides: Partial<ReturnType<typeof useHomeViewModel>> = {},
) {
  vi.mocked(useHomeViewModel).mockReturnValue({
    query: '',
    setQuery: vi.fn(),
    movies: [],
    loading: false,
    error: null,
    handleSearch: vi.fn(),
    loadInitialMovies: vi.fn(),
    handleFavouriteClick: vi.fn(),
    mood: '',
    setMood: vi.fn(),
    moodMovies: [],
    moodStatus: 'idle',
    moodError: null,
    submittedMood: '',
    submitMood: vi.fn(),
    ...overrides,
  })

  return render(<HomeView />)
}

describe('HomeView', () => {
  it('renders a mood textarea with a 200 character limit', () => {
    renderHome()

    expect(screen.getByLabelText('Describe what you want to watch')).toHaveAttribute(
      'maxLength',
      '200',
    )
  })

  it('shows the Google Gemini privacy note', () => {
    renderHome()

    expect(
      screen.getByText(/Your text is processed by Google Gemini/),
    ).toBeInTheDocument()
  })

  it('calls submitMood when the form is submitted', async () => {
    const user = userEvent.setup()
    const submitMood = vi.fn()

    renderHome({ submitMood })
    await user.click(screen.getByRole('button', { name: 'Find by mood' }))

    expect(submitMood).toHaveBeenCalledOnce()
  })

  it('disables the button and shows Finding movies while loading', () => {
    renderHome({ moodStatus: 'loading' })

    expect(screen.getByRole('button', { name: 'Find by mood' })).toBeDisabled()
    expect(screen.getByText('Finding movies...')).toBeInTheDocument()
  })

  it('renders moodError with an alert role', () => {
    renderHome({ moodError: 'Mood must be at least 3 characters.' })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Mood must be at least 3 characters.',
    )
  })

  it('shows recommendations and movie cards after success', () => {
    renderHome({
      moodStatus: 'success',
      submittedMood: 'cozy rainy night',
      moodMovies: [movie('Amélie'), movie('Paddington')],
    })

    expect(
      screen.getByRole('heading', {
        name: 'Recommendations for: cozy rainy night',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Amélie' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Paddington' })).toBeInTheDocument()
  })

  it('shows an empty message when no movies are found', () => {
    renderHome({ moodStatus: 'success', moodMovies: [] })

    expect(screen.getByText('No movies found for that mood.')).toBeInTheDocument()
  })
})
