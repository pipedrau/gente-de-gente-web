import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="navbar">
        <div className="shell nav">
          <Link className="logo" to="/">GENTE DE GENTE</Link>

          <button className="hamburger" aria-label="Abrir menú" onClick={() => setOpen(true)}>
            <span></span><span></span><span></span>
          </button>

          <nav className="menu desktop-menu" aria-label="Navegación principal">
            <div className="menu-main">
              <Link to="/shop">Shop</Link>
              <Link to="/about">About</Link>
              <Link to="/contacto">Contacto</Link>
            </div>
            <a className="btn-dark menu-ig" target="_blank" rel="noreferrer" href="https://www.instagram.com/gentedgente/">Instagram</a>
          </nav>
        </div>
      </header>

      <div className={`drawer-backdrop ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
        <aside className={`drawer ${open ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <button className="drawer-close" aria-label="Cerrar menú" onClick={() => setOpen(false)}>×</button>
          <nav className="drawer-menu">
            <Link to="/shop" onClick={() => setOpen(false)}>Shop</Link>
            <Link to="/about" onClick={() => setOpen(false)}>About</Link>
            <Link to="/contacto" onClick={() => setOpen(false)}>Contacto</Link>
            <a target="_blank" rel="noreferrer" href="https://www.instagram.com/gentedgente/" onClick={() => setOpen(false)}>Instagram</a>
          </nav>
        </aside>
      </div>

      <main className="shell">{children}</main>
      <footer><div className="shell">© {new Date().getFullYear()} Gente de Gente · Hecho con cariño.</div></footer>
    </>
  )
}
