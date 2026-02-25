import { Link } from 'react-router-dom'

export default function ProductCard({ p }) {
  return (
    <article className="card">
      <Link to={`/producto/${p.id}`}>
        <img src={p.img} alt={p.name} />
        <div className="card-body">
          <div className="tag">{p.cat}</div>
          <h3>{p.name}</h3>
          <div className="price">{p.price}</div>
          <div className="card-cta">Ver detalle</div>
        </div>
      </Link>
    </article>
  )
}
