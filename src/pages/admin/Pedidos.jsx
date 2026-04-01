import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { supabase } from '../../lib/supabase'
import { ChevronDown } from 'lucide-react'

const STATUSES = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado']
const LABELS = {
  pendiente:  'Pendiente',
  confirmado: 'Confirmado',
  enviado:    'Enviado',
  entregado:  'Entregado',
  cancelado:  'Cancelado',
}

export default function AdminPedidos() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    setLoading(true)
    let q = supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') q = q.eq('status', filter)
    q.then(({ data }) => { setOrders(data || []); setLoading(false) })
  }, [filter])

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  return (
    <AdminLayout>
      <div className="admin-page-head">
        <h2>Pedidos</h2>
      </div>
      <div className="filter-tabs">
        {['all', ...STATUSES].map(s => (
          <button
            key={s}
            className={`tab ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? 'Todos' : LABELS[s]}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="admin-loading">Cargando...</div>
      ) : orders.length === 0 ? (
        <p className="empty-msg">No hay pedidos{filter !== 'all' ? ` con estado "${LABELS[filter]}"` : ''}.</p>
      ) : (
        <div className="orders-list">
          {orders.map(o => (
            <div key={o.id} className="order-card">
              <div
                className="order-card-head"
                onClick={() => setExpanded(expanded === o.id ? null : o.id)}
              >
                <div className="order-card-left">
                  <span className="mono">#{o.id.slice(0, 8).toUpperCase()}</span>
                  <span className="order-name">{o.customer_name}</span>
                  <span className="order-phone">{o.customer_phone}</span>
                </div>
                <div className="order-card-meta">
                  <strong>${(o.total || 0).toLocaleString('es-CO')} COP</strong>
                  <span className={`status-badge ${o.status}`}>{LABELS[o.status] || o.status}</span>
                  <select
                    value={o.status}
                    onChange={e => updateStatus(o.id, e.target.value)}
                    onClick={e => e.stopPropagation()}
                    className="status-select"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{LABELS[s]}</option>)}
                  </select>
                  <ChevronDown
                    size={16}
                    style={{ transform: expanded === o.id ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s' }}
                  />
                </div>
              </div>
              {expanded === o.id && (
                <div className="order-card-body">
                  <div className="order-detail-grid">
                    <div>
                      <p><strong>Teléfono:</strong> {o.customer_phone}</p>
                      {o.customer_email && <p><strong>Email:</strong> {o.customer_email}</p>}
                      {o.customer_city && <p><strong>Ciudad:</strong> {o.customer_city}</p>}
                      {o.customer_address && <p><strong>Dirección:</strong> {o.customer_address}</p>}
                      {o.notes && <p><strong>Notas:</strong> {o.notes}</p>}
                    </div>
                    <div>
                      <p><strong>Fecha:</strong> {new Date(o.created_at).toLocaleString('es-CO')}</p>
                      {o.coupon_code && <p><strong>Cupón:</strong> {o.coupon_code}</p>}
                      {o.discount > 0 && <p><strong>Descuento:</strong> ${o.discount.toLocaleString('es-CO')} COP</p>}
                      <p><strong>Total:</strong> ${(o.total || 0).toLocaleString('es-CO')} COP</p>
                    </div>
                  </div>
                  <div className="table-wrap">
                    <table className="order-items-table">
                      <thead>
                        <tr><th>Producto</th><th>Talla</th><th>Cant.</th><th>Precio unit.</th><th>Subtotal</th></tr>
                      </thead>
                      <tbody>
                        {(Array.isArray(o.items) ? o.items : []).map((item, i) => (
                          <tr key={i}>
                            <td>{item.name}</td>
                            <td>{item.size}</td>
                            <td>{item.quantity}</td>
                            <td>${(item.unit_price || 0).toLocaleString('es-CO')}</td>
                            <td>${((item.unit_price || 0) * item.quantity).toLocaleString('es-CO')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <a
                    className="btn-dark btn-sm"
                    href={`https://wa.me/${o.customer_phone.replace(/\D/g, '')}?text=Hola ${encodeURIComponent(o.customer_name)}, te escribimos de Gente de Gente sobre tu pedido %23${o.id.slice(0, 8).toUpperCase()}.`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Contactar por WhatsApp
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
