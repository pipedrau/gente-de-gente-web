import { useState } from 'react'
import { Search, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home() {
  const [open, setOpen] = useState(false)
  const A = (name) => `${import.meta.env.BASE_URL}assets/${name}`

  return (
    <main className="home">
      <section className="topbar">
        <div className="top-icons">
          <a className="icon-btn" href="#" aria-label="Buscar"><Search /></a>
          <a className="icon-btn" href="#" aria-label="Carrito"><ShoppingCart /></a>
        </div>
        <div className="brand">GENTE<br/>DE GENTE</div>
        <div className="pills">
          <div className="shop-wrap">
            <button className="pill shop" onClick={() => setOpen(v => !v)}>SHOP</button>
            <div className={`shop-dropdown ${open ? 'open' : ''}`}>
              <Link to="/shop/personajes" onClick={() => setOpen(false)}>Personajes</Link>
              <Link to="/shop/ropa" onClick={() => setOpen(false)}>Ropa</Link>
              <Link to="/shop/papeleria" onClick={() => setOpen(false)}>Papelería</Link>
              <Link to="/shop/casa" onClick={() => setOpen(false)}>Casa</Link>
              <Link to="/shop/todo" onClick={() => setOpen(false)}>Ver todo</Link>
            </div>
          </div>
          <Link className="pill about" to="/about">ABOUT</Link>
          <Link className="pill contact" to="/contacto">CONTACTO</Link>
        </div>
      </section>

      <section className="marquee"><div className="track"><span>WE CELEBRATE PEOPLE •</span><span>WE CELEBRATE PEOPLE •</span><span>WE CELEBRATE PEOPLE •</span><span>WE CELEBRATE PEOPLE •</span></div></section>

      <section className="hero-image">
        <img src={A('hero-collection-v2.webp')} alt="Nueva colección" />
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
        <a className="cell c1" href="https://www.instagram.com/gentedgente/" target="_blank" rel="noreferrer">◉</a>
        <a className="cell c2" href="https://www.instagram.com/gentedgente/" target="_blank" rel="noreferrer">◉</a>
        <a className="cell c3" href="https://www.instagram.com/gentedgente/" target="_blank" rel="noreferrer">◉</a>
      </section>
      <div className="footer-space"></div>
    </main>
  )
}
