import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import SEO from '../components/SEO'
import { getProducts } from '../lib/api'

export default function Shop() {
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const title = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Shop'

  useEffect(() => {
    setLoading(true)
    getProducts(category)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [category])

  const cats = [
    { slug: 'todo', label: 'Ver todo' },
    { slug: 'personajes', label: 'Personajes' },
    { slug: 'ropa', label: 'Ropa' },
    { slug: 'papeleria', label: 'Papelería' },
    { slug: 'casa', label: 'Casa' },
  ]

  return (
    <Layout>
      <SEO
        title={category && category !== 'todo' ? title : 'Shop'}
        description={`Colección ${title.toLowerCase()} de Gente de Gente. Diseño artesanal colombiano.`}
      />
      <section className="page-head">
        <h2>{title}</h2>
        <div className="kicker">Colección {title.toLowerCase()} de Gente de Gente.</div>
      </section>
      <div className="shop-tabs">
        {cats.map(c => {
          const active = (!category && c.slug === 'todo') || category === c.slug
          return (
            <Link
              key={c.slug}
              className={`tab ${active ? 'active' : ''}`}
              to={c.slug === 'todo' ? '/shop' : `/shop/${c.slug}`}
            >
              {c.label}
            </Link>
          )
        })}
      </div>
      {loading ? (
        <div className="shop-loading">
          {[...Array(6)].map((_, i) => <div key={i} className="card-skeleton" />)}
        </div>
      ) : (
        <section className="grid shop-grid">
          {products.length > 0
            ? products.map(p => <ProductCard key={p.id} p={p} />)
            : <p className="empty-msg">No hay productos en esta categoría.</p>
          }
        </section>
      )}
    </Layout>
  )
}
