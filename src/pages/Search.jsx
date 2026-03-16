import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import SEO from '../components/SEO'
import { products } from '../data'

export default function Search() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  const results = useMemo(() => {
    if (!q.trim()) return []
    const term = q.toLowerCase()
    return products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.cat.toLowerCase().includes(term)
    )
  }, [q])

  return (
    <Layout>
      <SEO title={q ? `Búsqueda: ${q}` : 'Buscar'} />
      <section className="page-head">
        <h2>Búsqueda</h2>
        <div className="kicker">
          {q
            ? `${results.length} resultado${results.length !== 1 ? 's' : ''} para "${q}"`
            : 'Escribe algo para buscar'}
        </div>
      </section>

      {q && (
        results.length > 0
          ? <section className="grid shop-grid">{results.map(p => <ProductCard key={p.id} p={p} />)}</section>
          : (
            <div className="search-empty">
              <p>No encontramos productos para <strong>"{q}"</strong>.</p>
              <Link className="btn-dark" to="/shop">Ver todos los productos</Link>
            </div>
          )
      )}
    </Layout>
  )
}
