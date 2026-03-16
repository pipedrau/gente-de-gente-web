import { X, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, totalItems, cartOpen, closeCart } = useCart()

  const total = items.reduce((sum, i) => {
    const num = parseInt(i.product.price.replace(/[^0-9]/g, ''), 10)
    return sum + (isNaN(num) ? 0 : num * i.quantity)
  }, 0)

  const whatsappLines = items
    .map(i => `- ${i.product.name} (${i.size}) x${i.quantity}`)
    .join('%0A')
  const whatsappMsg = `Hola! Me interesa pedir:%0A${whatsappLines}`

  return (
    <>
      <div className={`cart-backdrop ${cartOpen ? 'open' : ''}`} onClick={closeCart} />
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h3>
            Carrito
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </h3>
          <button className="cart-close" aria-label="Cerrar carrito" onClick={closeCart}>
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Tu carrito está vacío</p>
            <Link className="btn-dark" to="/shop" onClick={closeCart}>Ver productos</Link>
          </div>
        ) : (
          <>
            <ul className="cart-items">
              {items.map(item => (
                <li key={item.key} className="cart-item">
                  <img src={item.product.img} alt={item.product.name} />
                  <div className="cart-item-info">
                    <strong>{item.product.name}</strong>
                    <span className="cart-item-size">{item.size}</span>
                    <span className="cart-item-price">{item.product.price}</span>
                    <div className="cart-qty">
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Reducir cantidad"
                      >−</button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        aria-label="Aumentar cantidad"
                      >+</button>
                    </div>
                  </div>
                  <button
                    className="cart-remove"
                    aria-label="Eliminar producto"
                    onClick={() => removeFromCart(item.key)}
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total estimado</span>
                <strong>${total.toLocaleString('es-CO')} COP</strong>
              </div>
              <a
                className="btn-dark cart-checkout"
                href={`https://wa.me/573000000000?text=${whatsappMsg}`}
                target="_blank"
                rel="noreferrer"
                onClick={closeCart}
              >
                Pedir por WhatsApp
              </a>
              <p className="cart-note">* Los precios son referenciales. Te confirmamos el total por WhatsApp.</p>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
