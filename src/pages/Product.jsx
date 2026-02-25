import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { products } from '../data'

export default function Product() {
  const { id } = useParams()
  const p = products.find(x => x.id === id) || products[0]
  return (
    <Layout>
      <section className="page-head"><h2>{p.name}</h2><div className="kicker">Detalle de producto</div></section>
      <section className="product-layout">
        <div className="product-image"><img src={p.img} alt={p.name} /></div>
        <div>
          <span className="tag">{p.cat}</span>
          <p>{p.name} es una pieza creada para celebrar lo cotidiano con diseño, color y carácter artesanal.</p>
          <div className="price">{p.price}</div>
          <Link className="btn-dark" to="/contacto">Solicitar por WhatsApp</Link>
        </div>
      </section>
    </Layout>
  )
}
