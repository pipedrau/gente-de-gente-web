import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  if (loading) return <div className="admin-loading">Cargando...</div>
  if (!session) return <Navigate to="/admin/login" replace />
  return children
}
