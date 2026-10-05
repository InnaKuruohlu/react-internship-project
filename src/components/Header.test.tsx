import { render, screen } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../context/AuthContext'
import { useHomeViewModel } from '../pages/Home/useHomeViewModel.tsx'
import Header from './Header'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../pages/Home/useHomeViewModel.tsx', () => ({
  useHomeViewModel: vi.fn(),
}))

const user = { uid: 'user-1' } as User

function mockAuth(nextUser: User | null) {
  vi.mocked(useAuth).mockReturnValue({
    user: nextUser,
    authLoading: false,
    logout: vi.fn(),
  })
}

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )
}

describe('Header', () => {
  beforeEach(() => {
    vi.mocked(useHomeViewModel).mockReturnValue({
      query: '',
      setQuery: vi.fn(),
      handleSearch: vi.fn(),
      loadInitialMovies: vi.fn(),
    } as unknown as ReturnType<typeof useHomeViewModel>)
  })

  it('shows the Login link and navigation links when signed out', () => {
    mockAuth(null)

    renderHeader()

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Favourites' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument()
  })

  it('shows a logout control and navigation links when signed in', () => {
    mockAuth(user)

    renderHeader()

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Favourites' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument()
  })
})
