import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type GuestRouteProps = {
  children: React.ReactNode
}

function GuestRoute({ children }: GuestRouteProps) {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return <div className="auth-loading">Loading...</div>
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}

export default GuestRoute
