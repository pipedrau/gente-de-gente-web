import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import { supabase } from '../../lib/supabase'

const STATUS_LABELS = {
  pendiente:  'Pendiente',
  confirmado: 'Confirmado',
  enviado:    'Enviado',
  entregado:  'Entregado',
  cancelado:  'Cancelado',
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [productCount, setProductCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('active', true),
    ]).then(([{ data: ords }, { count }]) => {
      setOrders(ords || [])
      setProductCount(count || 0)
      setLoading(false)
    })
  }, [])

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelado')
    .reduce((s, o) => s + (o.total || 0), 0)

  const pendingCount = orders.filter(o => o.status === 'pendiente').length

  return (
    <AdminLayout>
      <div className="admin-page-head">
        <h2>Dashboard</h2>
      </div>
      {loading ? (
        <div className="admin-loading">Cargando...</div>
      ) : (
        <>
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-num">{orders.length}</div>
              <div className="stat-label">Pedidos recientes</div>
            </div>
            <div className="stat-card warning">
              <div className="stat-num">{pendingCount}</div>
              <div className="stat-label">Pendientes</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{productCount}</div>
              <div className="stat-label">Productos activos</div>
            </div>
            <div className="stat-card green">
              <div className="stat-num">${totalRevenue.toLocaleString('es-CO')}</div>
              <div className="stat-label">Ingresos (recientes)</div>
            </div>
          </div>

          <div className="admin-section">
            <div className="admin-section-head">
              <h3>Últimos pedidos</h3>
              <Link to="/admin/pedidos" className="btn-outline btn-sm">Ver todos</Link>
            </div>
            {orders.length === 0 ? (
              <p className="empty-msg">Aún no hay pedidos.</p>
            ) : (
              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td className="mono">#{o.id.slice(0, 8).toUpperCase()}</td>
                        <td>{o.customer_name}</td>
                        <td>${(o.total || 0).toLocaleString('es-CO')}</td>
                        <td>
                          <span className={`status-badge ${o.status}`}>
                            {STATUS_LABELS[o.status] || o.status}
                          </span>
                        </td>
                        <td>{new Date(o.created_at).toLocaleDateString('es-CO')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  )
}
