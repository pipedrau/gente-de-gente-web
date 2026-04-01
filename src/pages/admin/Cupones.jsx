import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { supabase } from '../../lib/supabase'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const EMPTY = {
  code: '', type: 'percent', value: '',
  min_purchase: 0, active: true, expires_at: '',
}

export default function AdminCupones() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setCoupons(data || []); setLoading(false) })
  }

  useEffect(load, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setModal(true) }

  const openEdit = (c) => {
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      min_purchase: c.min_purchase || 0,
      active: c.active,
      expires_at: c.expires_at ? c.expires_at.slice(0, 10) : '',
    })
    setEditId(c.id)
    setError('')
    setModal(true)
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.code.trim() || !form.value) {
      setError('Código y valor son obligatorios.')
      return
    }
    setSaving(true)
    setError('')
    const payload = {
      code: form.code.toUpperCase().trim(),
      type: form.type,
      value: parseInt(form.value, 10),
      min_purchase: parseInt(form.min_purchase, 10) || 0,
      active: form.active,
      expires_at: form.expires_at || null,
    }
    const { error: err } = editId
      ? await supabase.from('coupons').update(payload).eq('id', editId)
      : await supabase.from('coupons').insert([payload])
    if (err) { setError(err.message); setSaving(false); return }
    setModal(false)
    setSaving(false)
    load()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este cupón?')) return
    await supabase.from('coupons').delete().eq('id', id)
    load()
  }

  return (
    <AdminLayout>
      <div className="admin-page-head">
        <h2>Cupones</h2>
        <button className="btn-dark" onClick={openCreate}>
          <Plus size={16} /> Nuevo cupón
        </button>
      </div>
      {loading ? (
        <div className="admin-loading">Cargando...</div>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Compra mín.</th>
                <th>Vence</th>
                <th>Activo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id}>
                  <td className="mono">{c.code}</td>
                  <td>{c.type === 'percent' ? 'Porcentaje' : 'Monto fijo'}</td>
                  <td>{c.type === 'percent' ? `${c.value}%` : `$${c.value.toLocaleString('es-CO')}`}</td>
                  <td>${(c.min_purchase || 0).toLocaleString('es-CO')}</td>
                  <td>{c.expires_at ? new Date(c.expires_at).toLocaleDateString('es-CO') : '—'}</td>
                  <td>
                    <span className={`status-badge ${c.active ? 'entregado' : 'cancelado'}`}>
                      {c.active ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="admin-actions">
                    <button className="icon-action" onClick={() => openEdit(c)} title="Editar">
                      <Pencil size={15} />
                    </button>
                    <button className="icon-action danger" onClick={() => handleDelete(c.id)} title="Eliminar">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editId ? 'Editar cupón' : 'Nuevo cupón'}</h3>
              <button className="modal-close" onClick={() => setModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="admin-form">
              <div className="form-row">
                <label>
                  Código *
                  <input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="DESCUENTO20"
                    style={{ textTransform: 'uppercase' }}
                  />
                </label>
                <label>
                  Tipo
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option value="percent">Porcentaje (%)</option>
                    <option value="fixed">Monto fijo (COP)</option>
                  </select>
                </label>
              </div>
              <div className="form-row">
                <label>
                  Valor * {form.type === 'percent' ? '(%)' : '(COP)'}
                  <input
                    name="value"
                    type="number"
                    value={form.value}
                    onChange={handleChange}
                    placeholder={form.type === 'percent' ? '20' : '10000'}
                    min="1"
                  />
                </label>
                <label>
                  Compra mínima (COP)
                  <input
                    name="min_purchase"
                    type="number"
                    value={form.min_purchase}
                    onChange={handleChange}
                    placeholder="50000"
                    min="0"
                  />
                </label>
              </div>
              <label>
                Fecha de vencimiento
                <input name="expires_at" type="date" value={form.expires_at} onChange={handleChange} />
              </label>
              <label className="checkbox-label">
                <input name="active" type="checkbox" checked={form.active} onChange={handleChange} />
                Cupón activo
              </label>
              {error && <p className="form-error">{error}</p>}
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setModal(false)}>Cancelar</button>
                <button type="submit" className="btn-dark" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
