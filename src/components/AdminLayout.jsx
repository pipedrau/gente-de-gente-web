import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, Package, ShoppingBag, Tag, LayoutDashboard, ExternalLink } from 'lucide-react'

const links = [
  { to: '/admin',           label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/productos', label: 'Productos',  icon: Package },
  { to: '/admin/pedidos',   label: 'Pedidos',    icon: ShoppingBag },
  { to: '/admin/cupones',   label: 'Cupones',    icon: Tag },
]

export default function AdminLayout({ children }) {
  const { signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="admin-wrap">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-logo">Gente de Gente</span>
          <span className="admin-badge">Admin</span>
        </div>
        <nav className="admin-nav">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`admin-nav-link ${location.pathname === to ? 'active' : ''}`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-link" target="_blank">
            <ExternalLink size={17} /> Ver tienda
          </Link>
          <button className="admin-signout" onClick={handleSignOut}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="admin-content">
        {children}
      </main>
    </div>
  )
}
