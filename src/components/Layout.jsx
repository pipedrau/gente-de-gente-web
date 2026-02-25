import { Link } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <>
      <header className="navbar">
        <div className="shell nav">
          <Link className="logo" to="/">Gente de Gente</Link>
          <nav className="menu" aria-label="Navegación principal">
            <div className="menu-main">
              <Link to="/shop">Shop</Link>
              <Link to="/about">About</Link>
              <Link to="/contacto">Contacto</Link>
            </div>
            <a className="btn-dark menu-ig" target="_blank" rel="noreferrer" href="https://www.instagram.com/gentedgente/">Instagram</a>
          </nav>
        </div>
      </header>
      <main className="shell">{children}</main>
      <footer><div className="shell">© {new Date().getFullYear()} Gente de Gente · Hecho con cariño.</div></footer>
    </>
  )
}
