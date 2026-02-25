import Layout from '../components/Layout'

export default function Contacto(){
  return <Layout><section className="page-head"><h2>Contacto</h2><div className="kicker">Cuéntanos qué te gustaría comprar o cotizar</div></section><form className="form"><input placeholder="Nombre"/><input placeholder="Email"/><textarea rows="6" placeholder="Mensaje"></textarea><button className="btn-dark" type="button">Enviar</button></form></Layout>
}
