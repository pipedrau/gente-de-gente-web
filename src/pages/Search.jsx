import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import SEO from '../components/SEO'
import { searchProducts } from '../lib/api'

export default function Search() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    searchProducts(q.trim())
      .then(setResults)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [q])

  return (
    <Layout>
      <SEO title={q ? `Búsqueda: ${q}` : 'Buscar'} />
      <section className="page-head">
        <h2>Búsqueda</h2>
        <div className="kicker">
          {loading
            ? 'Buscando...'
            : q
              ? `${results.length} resultado${results.length !== 1 ? 's' : ''} para "${q}"`
              : 'Escribe algo para buscar'}
        </div>
      </section>
      {!loading && q && (
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
