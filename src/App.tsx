import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GuestRoute from './components/GuestRoute'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import AuthView from './pages/Auth/AuthView'
import FavouritesView from './pages/Favourites/FavouritesView'
import HomeView from './pages/Home/HomeView'
import { HomeViewModelProvider } from './pages/Home/useHomeViewModel.tsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <HomeViewModelProvider>
          <Header />
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route
              path="/auth"
              element={
                <GuestRoute>
                  <AuthView />
                </GuestRoute>
              }
            />
            <Route
              path="/favourites"
              element={
                <ProtectedRoute>
                  <FavouritesView />
                </ProtectedRoute>
              }
            />
          </Routes>
        </HomeViewModelProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
