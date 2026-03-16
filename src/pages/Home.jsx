import { useState, useRef, useEffect } from 'react'
import { Instagram, Search, ShoppingCart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import SEO from '../components/SEO'

export default function Home() {
  const [open, setOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const { totalItems, openCart } = useCart()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)
  const A = (name) => `${import.meta.env.BASE_URL}assets/${name}`

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

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
    <main className="home">
      <SEO
        title={null}
        description="Personajes, ropa, papelería y objetos para el hogar. Diseño ilustrado artesanal colombiano."
      />
      <section className="topbar">
        <div className="top-icons">
          <button
            className="icon-btn"
            aria-label="Buscar"
            onClick={() => setSearchOpen(v => !v)}
          >
            <Search />
          </button>
          <button
            className="icon-btn cart-icon-btn"
            aria-label="Carrito"
            onClick={openCart}
          >
            <ShoppingCart />
            {totalItems > 0 && <span className="cart-badge home-cart-badge">{totalItems}</span>}
          </button>
        </div>

        {searchOpen && (
          <div className="home-search-wrap" ref={searchRef}>
            <form className="home-search-form" onSubmit={handleSearch}>
              <input
                autoFocus
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Buscar productos..."
                aria-label="Buscar productos"
              />
              <button type="submit" aria-label="Buscar"><Search size={16} /></button>
            </form>
          </div>
        )}

        <div className="brand"><img src={A('gdg_logo_vertical_300.webp')} alt="Gente de Gente" /></div>
        <div className="pills">
          <div className="shop-wrap" ref={dropdownRef}>
            <button className="pill shop" onClick={() => setOpen(v => !v)}>SHOP</button>
            <div className={`shop-dropdown ${open ? 'open' : ''}`}>
              <Link to="/shop/personajes" onClick={() => setOpen(false)}>Personajes</Link>
              <Link to="/shop/ropa" onClick={() => setOpen(false)}>Ropa</Link>
              <Link to="/shop/papeleria" onClick={() => setOpen(false)}>Papelería</Link>
              <Link to="/shop/casa" onClick={() => setOpen(false)}>Casa</Link>
              <Link to="/shop" onClick={() => setOpen(false)}>Ver todo</Link>
            </div>
          </div>
          <Link className="pill about" to="/about">ABOUT</Link>
          <Link className="pill contact" to="/contacto">CONTACTO</Link>
          <a className="star-ig" href="https://www.instagram.com/gentedgente/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <Instagram />
          </a>
        </div>
      </section>

      <section className="marquee">
        <div className="marquee-inner">
          <div className="track"><span>WE CELEBRATE PEOPLE •</span><span>WE CELEBRATE PEOPLE •</span><span>WE CELEBRATE PEOPLE •</span><span>WE CELEBRATE PEOPLE •</span></div>
          <div className="track"><span>WE CELEBRATE PEOPLE •</span><span>WE CELEBRATE PEOPLE •</span><span>WE CELEBRATE PEOPLE •</span><span>WE CELEBRATE PEOPLE •</span></div>
        </div>
      </section>

      <section className="hero-image">
        <img src={A('hero-collection-v3.webp')} alt="Nueva colección" />
        <div className="badge">Nueva<br/>Colección</div>
      </section>

      <section className="block pink">
        <div className="img"><img src={A('block-sofa-v2.webp')} alt="Decoración" /></div>
        <div className="txt">Para<br/>decorar<br/>tu sofá</div>
      </section>

      <section className="block yellow">
        <div className="txt">For<br/>everyday<br/>joy</div>
        <div className="img"><img src={A('block-hanger-v2.webp')} alt="Ropa" /></div>
      </section>

      <section className="block green">
        <div className="img"><img src={A('block-mugs-v2.webp')} alt="Mugs" /></div>
        <div className="txt">For<br/>everyday<br/>joy</div>
      </section>

      <section className="statement">Creativity for<br/>everyday inspo</section>
      <section className="social-strip">
        <a className="cell c1" href="https://www.instagram.com/gentedgente/" target="_blank" rel="noreferrer" aria-label="Instagram">◉</a>
        <a className="cell c2" href="https://www.instagram.com/gentedgente/" target="_blank" rel="noreferrer" aria-label="Instagram">◉</a>
        <a className="cell c3" href="https://www.instagram.com/gentedgente/" target="_blank" rel="noreferrer" aria-label="Instagram">◉</a>
      </section>
      <div className="footer-space"></div>
    </main>
  )
}
