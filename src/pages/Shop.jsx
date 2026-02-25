import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { products } from '../data'

export default function Shop() {
  const { category } = useParams()
  const title = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Shop'

  const filtered = useMemo(() => {
    if (!category || category === 'todo') return products
    return products.filter(p => p.cat === category)
  }, [category])

  const cats = [
    { slug: 'todo', label: 'Ver todo' },
    { slug: 'personajes', label: 'Personajes' },
    { slug: 'ropa', label: 'Ropa' },
    { slug: 'papeleria', label: 'Papelería' },
    { slug: 'casa', label: 'Casa' }
  ]

  return (
    <Layout>
      <section className="page-head"><h2>{title}</h2><div className="kicker">Colección {title.toLowerCase()} de Gente de Gente.</div></section>
      <div className="shop-tabs">
        {cats.map(c => {
          const active = (!category && c.slug === 'todo') || category === c.slug
          return (
            <Link key={c.slug} className={`tab ${active ? 'active' : ''}`} to={c.slug === 'todo' ? '/shop' : `/shop/${c.slug}`}>
              {c.label}
            </Link>
          )
        })}
      </div>
      <section className="grid shop-grid">{filtered.map(p => <ProductCard key={p.id} p={p} />)}</section>
    </Layout>
  )
}
