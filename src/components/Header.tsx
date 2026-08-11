import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useHomeViewModel } from '../pages/Home/useHomeViewModel.tsx'
import './Header.css'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { query, setQuery, handleSearch, loadInitialMovies } = useHomeViewModel()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    handleSearch()
  }

  function handleHomeClick() {
    setQuery('')

    if (location.pathname === '/') {
      void loadInitialMovies()
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="header">
      <nav className="header__nav" aria-label="Main navigation">
        <NavLink to="/" className="header__link" end onClick={handleHomeClick}>
          Home
        </NavLink>
        <NavLink to="/favourites" className="header__link">
          Favourites
        </NavLink>
        {user ? (
          <button
            type="button"
            className="header__logout-button"
            onClick={() => {
              void handleLogout()
            }}
          >
            Logout
          </button>
        ) : (
          <NavLink to="/auth" className="header__link">
            Login
          </NavLink>
        )}
      </nav>

      <form className="header__search" onSubmit={onSubmit}>
        <input
          type="search"
          className="header__search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search movies..."
          aria-label="Search movies"
        />
        <button type="submit" className="header__search-button">
          Search
        </button>
      </form>
    </header>
  )
}

export default Header
