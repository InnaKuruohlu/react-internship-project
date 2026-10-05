import { render, screen } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { useAuth } from '../context/AuthContext'
import GuestRoute from './GuestRoute'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const user = { uid: 'user-1' } as User

function mockAuth(nextUser: User | null) {
  vi.mocked(useAuth).mockReturnValue({
    user: nextUser,
    authLoading: false,
    logout: vi.fn(),
  })
}

function renderGuestRoute() {
  return render(
    <MemoryRouter initialEntries={['/auth']}>
      <Routes>
        <Route
          path="/auth"
          element={
            <GuestRoute>
              <h1>Login</h1>
            </GuestRoute>
          }
        />
        <Route path="/" element={<h1>Home</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('GuestRoute', () => {
  it('renders the child when there is no user', () => {
    mockAuth(null)

    renderGuestRoute()

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })

  it('redirects away from the login page when a user exists', () => {
    mockAuth(user)

    renderGuestRoute()

    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Login' })).not.toBeInTheDocument()
  })
})
