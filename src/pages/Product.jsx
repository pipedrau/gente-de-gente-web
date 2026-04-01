import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { getProduct } from '../lib/api'
import { useCart } from '../context/CartContext'

export default function Product() {
  const { id } = useParams()
  const { addToCart, openCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setProduct(null)
    getProduct(id)
      .then(p => {
        setProduct(p)
        setSize(p.sizes?.[0] || 'Único')
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <Layout>
        <section className="page-head"><h2>Cargando...</h2></section>
        <div className="product-layout product-detail">
          <div className="card-skeleton" style={{ height: 400 }} />
          <div className="card-skeleton" style={{ height: 400 }} />
        </div>
      </Layout>
    )
  }

  if (notFound || !product) {
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
    addToCart(product, size, qty)
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Layout>
      <SEO
        title={product.name}
        description={`${product.name} — ${product.price}. Pieza artesanal de Gente de Gente.`}
        image={product.img}
      />
      <section className="page-head">
        <h2>{product.name}</h2>
        <div className="kicker">Detalle de producto</div>
      </section>
      <section className="product-layout product-detail">
        <div className="product-image">
          <img src={product.img} alt={product.name} />
        </div>
        <div className="product-panel">
          <span className="tag">{product.cat}</span>
          <p>{product.description || `${product.name} es una pieza creada para celebrar lo cotidiano con diseño, color y carácter artesanal.`}</p>
          <div className="price">{product.price}</div>
          {product.compare_price && (
            <div className="price-compare">${Number(product.compare_price).toLocaleString('es-CO')} COP</div>
          )}
          <div className="product-controls">
            {product.sizes && product.sizes.length > 0 && (
              <label>Talla / Tamaño
                <select value={size} onChange={e => setSize(e.target.value)}>
                  {product.sizes.map(s => <option key={s}>{s}</option>)}
                </select>
              </label>
            )}
            <label>Cantidad
              <input
                type="number"
                min="1"
                max={product.stock || 99}
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
            {product.stock > 0 && <span>{product.stock} disponibles</span>}
          </div>
        </div>
      </section>
    </Layout>
  )
}
