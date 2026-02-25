import Layout from '../components/Layout'

const valores = [
  'Hecho a mano con amor',
  'Diseño colorido con identidad propia',
  'Ediciones pequeñas y cuidadas',
  'Productos para celebrar lo cotidiano'
]

export default function About() {
  return (
    <Layout>
      <section className="page-head">
        <h2>About</h2>
        <div className="kicker">We celebrate people</div>
      </section>

      <section className="about-hero">
        <div>
          <h3>Somos Gente de Gente</h3>
          <p>
            Una marca creada por Juanita, donde cada pieza nace del cruce entre ilustración,
            textil, color y oficio artesanal. Diseñamos y producimos personajes, ropa,
            papelería y objetos para el hogar con un lenguaje visual alegre y cercano.
          </p>
          <p>
            Nuestro foco está en crear objetos con personalidad que acompañen la vida diaria,
            mezclando humor, calidez y diseño.
          </p>
        </div>
        <img src={`${import.meta.env.BASE_URL}assets/hero-collection-v2.webp`} alt="Equipo y universo Gente de Gente" />
      </section>

      <section className="about-grid">
        <article className="about-card">
          <h4>Qué hacemos</h4>
          <ul>
            <li>Personajes textiles ilustrados</li>
            <li>Ropa y accesorios coloridos</li>
            <li>Papelería y piezas gráficas</li>
            <li>Objetos para casa y regalos</li>
          </ul>
        </article>

        <article className="about-card">
          <h4>Cómo trabajamos</h4>
          <ul>
            <li>Diseño propio + producción artesanal</li>
            <li>Selección de materiales con criterio estético</li>
            <li>Ediciones limitadas por temporadas</li>
            <li>Pruebas de color y acabados en cada colección</li>
          </ul>
        </article>

        <article className="about-card about-values">
          <h4>Nuestros valores</h4>
          <div className="value-chips">
            {valores.map(v => <span key={v}>{v}</span>)}
          </div>
        </article>
      </section>
    </Layout>
  )
}
