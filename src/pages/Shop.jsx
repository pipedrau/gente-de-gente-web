import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
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

  return (
    <Layout>
      <section className="page-head"><h2>{title}</h2><div className="kicker">Colección {title.toLowerCase()} de Gente de Gente.</div></section>
      <section className="grid">{filtered.map(p => <ProductCard key={p.id} p={p} />)}</section>
    </Layout>
  )
}
