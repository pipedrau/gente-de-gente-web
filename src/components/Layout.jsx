import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const { totalItems, openCart } = useCart()
  const navigate = useNavigate()
  const searchRef = useRef(null)

  // Cerrar búsqueda al hacer clic fuera
  useEffect(() => {
    if (!searchOpen) return
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [searchOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    const term = searchQ.trim()
    if (term) {
      navigate(`/buscar?q=${encodeURIComponent(term)}`)
      setSearchQ('')
      setSearchOpen(false)
    }
  }

  return (
    <>
      <header className="navbar">
        <div className="shell nav">
          <Link className="logo" to="/">
            <span className="logo-word">GENTE DE GENTE</span>
            <img className="logo-svg" src={`${import.meta.env.BASE_URL}assets/gdg_logo_horizontal_transparent_200.png`} alt="Gente de Gente" />
          </Link>

          <button className="hamburger" aria-label="Abrir menú" onClick={() => setOpen(true)}>
            <span></span><span></span><span></span>
          </button>

          <nav className="menu desktop-menu" aria-label="Navegación principal">
            <div className="menu-main">
              <Link to="/shop">Shop</Link>
              <Link to="/about">About</Link>
              <Link to="/contacto">Contacto</Link>
            </div>
            <div className="menu-actions">
              <button className="icon-btn nav-icon-btn" aria-label="Buscar" onClick={() => setSearchOpen(v => !v)}>
                <Search size={18} />
              </button>
              <button className="icon-btn nav-icon-btn cart-icon-btn" aria-label="Carrito" onClick={openCart}>
                <ShoppingCart size={18} />
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </button>
              <a className="btn-dark menu-ig" target="_blank" rel="noreferrer" href="https://www.instagram.com/gentedgente/">Instagram</a>
            </div>
          </nav>
        </div>

        {searchOpen && (
          <div className="search-bar-wrap" ref={searchRef}>
            <form className="search-bar shell" onSubmit={handleSearch}>
              <input
                autoFocus
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Buscar productos..."
                aria-label="Buscar productos"
              />
              <button type="submit" aria-label="Buscar">
                <Search size={16} />
              </button>
            </form>
          </div>
        )}
      </header>

      <div className={`drawer-backdrop ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
        <aside className={`drawer ${open ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <button className="drawer-close" aria-label="Cerrar menú" onClick={() => setOpen(false)}>×</button>
          <nav className="drawer-menu">
            <Link to="/shop" onClick={() => setOpen(false)}>Shop</Link>
            <Link to="/about" onClick={() => setOpen(false)}>About</Link>
            <Link to="/contacto" onClick={() => setOpen(false)}>Contacto</Link>
            <button
              className="drawer-cart-btn"
              onClick={() => { setOpen(false); openCart() }}
            >
              Carrito {totalItems > 0 && `(${totalItems})`}
            </button>
            <a target="_blank" rel="noreferrer" href="https://www.instagram.com/gentedgente/" onClick={() => setOpen(false)}>Instagram</a>
          </nav>
        </aside>
      </div>

      <main className="shell">{children}</main>
      <footer><div className="shell">© {new Date().getFullYear()} Gente de Gente · Hecho con cariño.</div></footer>
    </>
  )
}
