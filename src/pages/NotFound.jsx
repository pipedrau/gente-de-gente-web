import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import SEO from '../components/SEO'

export default function NotFound() {
  return (
    <Layout>
      <SEO title="Página no encontrada" />
      <section className="page-head">
        <h2>404</h2>
        <div className="kicker">Esta página no existe</div>
      </section>
      <div className="not-found">
        <p>Lo que buscas no está aquí, pero seguro hay algo que te va a gustar.</p>
        <div className="not-found-actions">
          <Link className="btn-dark" to="/shop">Ver productos</Link>
          <Link className="btn-outline" to="/">Volver al inicio</Link>
        </div>
      </div>
    </Layout>
  )
}
