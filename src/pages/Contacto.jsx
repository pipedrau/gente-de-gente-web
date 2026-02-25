import Layout from '../components/Layout'

const faqs = [
  { q: '¿Hacen productos personalizados?', a: 'Sí, según disponibilidad y tipo de producto.' },
  { q: '¿Cuánto tarda un pedido?', a: 'Entre 3 y 10 días hábiles, depende del volumen y ciudad.' },
  { q: '¿Hacen envíos nacionales?', a: 'Sí, hacemos envíos a toda Colombia.' }
]

export default function Contacto() {
  return (
    <Layout>
      <section className="page-head">
        <h2>Contacto</h2>
        <div className="kicker">Cuéntanos qué te gustaría comprar o cotizar</div>
      </section>

      <section className="contact-layout">
        <article className="contact-card">
          <h3>Escríbenos</h3>
          <form className="form contact-form">
            <input placeholder="Nombre" />
            <input placeholder="Email" />
            <input placeholder="Ciudad" />
            <select defaultValue="">
              <option value="" disabled>Tipo de solicitud</option>
              <option>Compra de producto</option>
              <option>Producto personalizado</option>
              <option>Colaboración</option>
            </select>
            <textarea rows="6" placeholder="Mensaje"></textarea>
            <button className="btn-dark" type="button">Enviar consulta</button>
          </form>
        </article>

        <aside className="contact-side">
          <div className="contact-card">
            <h4>Canales</h4>
            <ul className="contact-list">
              <li><strong>Instagram:</strong> @gentedgente</li>
              <li><strong>WhatsApp:</strong> +57 300 000 0000</li>
              <li><strong>Email:</strong> hola@gentedegente.co</li>
            </ul>
          </div>

          <div className="contact-card">
            <h4>Preguntas frecuentes</h4>
            <div className="faq-list">
              {faqs.map(item => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </Layout>
  )
}
