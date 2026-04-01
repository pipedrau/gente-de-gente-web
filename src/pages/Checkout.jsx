import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { useCart } from '../context/CartContext'
import { validateCoupon, createOrder } from '../lib/api'

export default function Checkout() {
  const { items, clearCart } = useCart()
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_city: '',
    customer_address: '',
    notes: '',
  })
  const [couponCode, setCouponCode] = useState('')
  const [couponResult, setCouponResult] = useState(null)
  const [validatingCoupon, setValidatingCoupon] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  const subtotal = items.reduce((sum, i) => {
    const num = i.product.priceNum ?? parseInt(i.product.price.replace(/[^0-9]/g, ''), 10)
    return sum + (isNaN(num) ? 0 : num * i.quantity)
  }, 0)
  const discount = couponResult?.valid ? couponResult.discount : 0
  const total = subtotal - discount

  if (items.length === 0 && !success) {
    return (
      <Layout>
        <SEO title="Checkout" />
        <section className="page-head"><h2>Carrito vacío</h2></section>
        <div className="not-found">
          <p>Agrega productos antes de proceder al checkout.</p>
          <Link className="btn-dark" to="/shop">Ver productos</Link>
        </div>
      </Layout>
    )
  }

  if (success) {
    const waLines = success.items
      .map(i => `- ${i.name} (${i.size}) x${i.quantity}`)
      .join('%0A')
    const waMsg = `Hola! Acabo de hacer un pedido %23${success.id.slice(0, 8).toUpperCase()}:%0A${waLines}%0ATotal: $${total.toLocaleString('es-CO')} COP`
    return (
      <Layout>
        <SEO title="Pedido confirmado" />
        <section className="page-head">
          <h2>¡Pedido recibido!</h2>
          <div className="kicker">Te contactaremos pronto para confirmar el envío.</div>
        </section>
        <div className="checkout-success">
          <p>Tu número de pedido es <strong>#{success.id.slice(0, 8).toUpperCase()}</strong>.</p>
          <p>También puedes confirmar directamente por WhatsApp:</p>
          <a
            className="btn-dark"
            href={`https://wa.me/573214981106?text=${waMsg}`}
            target="_blank"
            rel="noreferrer"
          >
            Confirmar por WhatsApp
          </a>
          <Link className="btn-outline" to="/shop">Seguir comprando</Link>
        </div>
      </Layout>
    )
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleCoupon = async (e) => {
    e.preventDefault()
    if (!couponCode.trim()) return
    setValidatingCoupon(true)
    const result = await validateCoupon(couponCode, subtotal)
    setCouponResult(result)
    setValidatingCoupon(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.customer_name.trim() || !form.customer_phone.trim()) {
      setError('Nombre y teléfono son obligatorios.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const orderItems = items.map(i => ({
        product_id: i.product.id,
        name: i.product.name,
        size: i.size,
        quantity: i.quantity,
        unit_price: i.product.priceNum ?? parseInt(i.product.price.replace(/[^0-9]/g, ''), 10),
      }))
      const order = await createOrder({
        ...form,
        items: orderItems,
        subtotal,
        discount,
        total,
        coupon_code: couponResult?.valid ? couponCode.toUpperCase() : null,
        status: 'pendiente',
      })
      clearCart()
      setSuccess({ ...order, items: orderItems })
    } catch (err) {
      setError('Hubo un problema al crear el pedido. Intenta de nuevo.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <SEO title="Checkout" />
      <section className="page-head">
        <h2>Checkout</h2>
        <div className="kicker">Completa tu pedido</div>
      </section>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Datos de contacto</h3>
          <div className="form-row">
            <label>Nombre completo *
              <input
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                required
                placeholder="Tu nombre"
              />
            </label>
            <label>Teléfono / WhatsApp *
              <input
                name="customer_phone"
                value={form.customer_phone}
                onChange={handleChange}
                required
                placeholder="+57 300 000 0000"
              />
            </label>
          </div>
          <label>Email
            <input
              name="customer_email"
              type="email"
              value={form.customer_email}
              onChange={handleChange}
              placeholder="tu@email.com"
            />
          </label>

          <h3>Dirección de envío</h3>
          <div className="form-row">
            <label>Ciudad
              <input
                name="customer_city"
                value={form.customer_city}
                onChange={handleChange}
                placeholder="Bogotá"
              />
            </label>
            <label>Dirección
              <input
                name="customer_address"
                value={form.customer_address}
                onChange={handleChange}
                placeholder="Calle 00 # 00 - 00"
              />
            </label>
          </div>
          <label>Notas del pedido
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Instrucciones especiales, referencias, etc."
              rows={3}
            />
          </label>

          <div className="coupon-row">
            <input
              value={couponCode}
              onChange={e => { setCouponCode(e.target.value); setCouponResult(null) }}
              placeholder="Código de descuento"
            />
            <button
              type="button"
              className="btn-outline"
              onClick={handleCoupon}
              disabled={validatingCoupon}
            >
              {validatingCoupon ? '...' : 'Aplicar'}
            </button>
          </div>
          {couponResult && (
            <p className={`coupon-msg ${couponResult.valid ? 'valid' : 'invalid'}`}>
              {couponResult.message}
            </p>
          )}

          {error && <p className="form-error">{error}</p>}
          <button
            className="btn-dark checkout-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Enviando...' : 'Confirmar pedido'}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>Tu pedido</h3>
          <ul className="summary-items">
            {items.map(i => (
              <li key={i.key}>
                <img src={i.product.img} alt={i.product.name} />
                <div className="summary-item-info">
                  <strong>{i.product.name}</strong>
                  <span>{i.size} × {i.quantity}</span>
                </div>
                <span className="summary-price">{i.product.price}</span>
              </li>
            ))}
          </ul>
          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString('es-CO')} COP</span>
            </div>
            {discount > 0 && (
              <div className="summary-row discount-row">
                <span>Descuento</span>
                <span>-${discount.toLocaleString('es-CO')} COP</span>
              </div>
            )}
            <div className="summary-row total-row">
              <strong>Total</strong>
              <strong>${total.toLocaleString('es-CO')} COP</strong>
            </div>
          </div>
          <p className="checkout-note">
            El envío se coordina por WhatsApp después de confirmar el pedido.
          </p>
        </div>
      </div>
    </Layout>
  )
}
