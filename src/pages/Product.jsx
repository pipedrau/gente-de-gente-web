import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { products } from '../data'

export default function Product() {
  const { id } = useParams()
  const p = products.find(x => x.id === id) || products[0]
  return (
    <Layout>
      <section className="page-head"><h2>{p.name}</h2><div className="kicker">Detalle de producto</div></section>
      <section className="product-layout product-detail">
        <div className="product-image"><img src={p.img} alt={p.name} /></div>
        <div className="product-panel">
          <span className="tag">{p.cat}</span>
          <p>{p.name} es una pieza creada para celebrar lo cotidiano con diseño, color y carácter artesanal.</p>
          <div className="price">{p.price}</div>
          <div className="product-controls">
            <label>Tamaño
              <select>
                <option>Mini</option>
                <option>Mediano</option>
              </select>
            </label>
            <label>Cantidad
              <input type="number" min="1" defaultValue="1" />
            </label>
          </div>
          <Link className="btn-dark product-btn" to="/contacto">Solicitar por WhatsApp</Link>
          <div className="product-notes">
            <span>Hecho a mano</span>
            <span>Envío nacional</span>
          </div>
        </div>
      </section>
    </Layout>
  )
}
