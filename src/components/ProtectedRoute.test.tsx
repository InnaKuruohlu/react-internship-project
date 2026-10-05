import { render, screen } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const user = { uid: 'user-1' } as User

function mockAuth(auth: { user: User | null; authLoading: boolean }) {
  vi.mocked(useAuth).mockReturnValue({
    ...auth,
    logout: vi.fn(),
  })
}

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={['/favourites']}>
      <Routes>
        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <h1>Favourites</h1>
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<h1>Login</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  it('shows the loading state while auth is loading', () => {
    mockAuth({ user: null, authLoading: true })

    renderProtectedRoute()

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Favourites' })).not.toBeInTheDocument()
  })

  it('redirects to the login page when there is no user', () => {
    mockAuth({ user: null, authLoading: false })

    renderProtectedRoute()

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Favourites' })).not.toBeInTheDocument()
  })

  it('renders the protected child when a user exists', () => {
    mockAuth({ user, authLoading: false })

    renderProtectedRoute()

    expect(screen.getByRole('heading', { name: 'Favourites' })).toBeInTheDocument()
  })
})
