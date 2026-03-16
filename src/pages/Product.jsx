import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { products } from '../data'
import { useCart } from '../context/CartContext'

export default function Product() {
  const { id } = useParams()
  const { addToCart, openCart } = useCart()
  const [size, setSize] = useState('Mini')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const p = products.find(x => x.id === id)

  if (!p) {
    return (
      <Layout>
        <SEO title="Producto no encontrado" />
        <section className="page-head">
          <h2>Producto no encontrado</h2>
          <div className="kicker">Este producto no existe o fue removido</div>
        </section>
        <div className="not-found">
          <p>Lo que buscas no está aquí, pero seguro hay algo que te va a gustar.</p>
          <div className="not-found-actions">
            <Link className="btn-dark" to="/shop">Ver todos los productos</Link>
            <Link className="btn-outline" to="/">Volver al inicio</Link>
          </div>
        </div>
      </Layout>
    )
  }

  const handleAddToCart = () => {
    addToCart(p, size, qty)
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Layout>
      <SEO
        title={p.name}
        description={`${p.name} — ${p.price}. Pieza artesanal de Gente de Gente.`}
        image={p.img}
      />
      <section className="page-head"><h2>{p.name}</h2><div className="kicker">Detalle de producto</div></section>
      <section className="product-layout product-detail">
        <div className="product-image"><img src={p.img} alt={p.name} /></div>
        <div className="product-panel">
          <span className="tag">{p.cat}</span>
          <p>{p.name} es una pieza creada para celebrar lo cotidiano con diseño, color y carácter artesanal.</p>
          <div className="price">{p.price}</div>
          <div className="product-controls">
            <label>Tamaño
              <select value={size} onChange={e => setSize(e.target.value)}>
                <option>Mini</option>
                <option>Mediano</option>
              </select>
            </label>
            <label>Cantidad
              <input
                type="number"
                min="1"
                value={qty}
                onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </label>
          </div>
          <button className="btn-dark product-btn" onClick={handleAddToCart}>
            {added ? '¡Agregado al carrito!' : 'Agregar al carrito'}
          </button>
          <Link className="btn-outline product-btn" to="/contacto">Consultar por WhatsApp</Link>
          <div className="product-notes">
            <span>Hecho a mano</span>
            <span>Envío nacional</span>
          </div>
        </div>
      </section>
    </Layout>
  )
}
