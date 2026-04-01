import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../lib/api'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const EMPTY_FORM = {
  id: '', name: '', description: '', price: '', compare_price: '',
  category: 'personajes', images: '', sizes: 'Mini,Mediano',
  stock: 0, active: true,
}

export default function AdminProductos() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'create' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setProducts(data || []); setLoading(false) })
  }

  useEffect(load, [])

  const openCreate = () => { setForm(EMPTY_FORM); setError(''); setModal('create') }

  const openEdit = (p) => {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description || '',
      price: p.price,
      compare_price: p.compare_price || '',
      category: p.category,
      images: (p.images || []).join(', '),
      sizes: (p.sizes || ['Mini', 'Mediano']).join(', '),
      stock: p.stock || 0,
      active: p.active ?? true,
    })
    setError('')
    setModal('edit')
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.id.trim() || !form.name.trim() || !form.price) {
      setError('ID, nombre y precio son obligatorios.')
      return
    }
    setSaving(true)
    setError('')
    const slug = form.id.trim().toLowerCase().replace(/\s+/g, '-')
    const payload = {
      id: slug,
      name: form.name.trim(),
      slug,
      description: form.description.trim(),
      price: parseInt(form.price, 10),
      compare_price: form.compare_price ? parseInt(form.compare_price, 10) : null,
      category: form.category,
      images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      stock: parseInt(form.stock, 10) || 0,
      active: form.active,
    }
    const { error: err } = modal === 'create'
      ? await supabase.from('products').insert([payload])
      : await supabase.from('products').update(payload).eq('id', payload.id)
    if (err) { setError(err.message); setSaving(false); return }
    setModal(null)
    setSaving(false)
    load()
  }

  const handleDeactivate = async (id) => {
    if (!window.confirm('¿Desactivar este producto? Dejará de aparecer en la tienda.')) return
    await supabase.from('products').update({ active: false }).eq('id', id)
    load()
  }

  return (
    <AdminLayout>
      <div className="admin-page-head">
        <h2>Productos</h2>
        <button className="btn-dark" onClick={openCreate}>
          <Plus size={16} /> Nuevo producto
        </button>
      </div>
      {loading ? (
        <div className="admin-loading">Cargando...</div>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Activo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td className="mono">{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`status-badge ${p.active ? 'entregado' : 'cancelado'}`}>
                      {p.active ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="admin-actions">
                    <button className="icon-action" onClick={() => openEdit(p)} title="Editar">
                      <Pencil size={15} />
                    </button>
                    {p.active && (
                      <button className="icon-action danger" onClick={() => handleDeactivate(p.id)} title="Desactivar">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{modal === 'create' ? 'Nuevo producto' : 'Editar producto'}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="admin-form">
              <div className="form-row">
                <label>
                  ID (slug) *
                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    disabled={modal === 'edit'}
                    placeholder="muneco-luna"
                  />
                </label>
                <label>
                  Nombre *
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Muñeco Luna" />
                </label>
              </div>
              <label>
                Descripción
                <textarea name="description" value={form.description} onChange={handleChange} rows={2} />
              </label>
              <div className="form-row">
                <label>
                  Precio (COP) *
                  <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="89000" />
                </label>
                <label>
                  Precio anterior (COP)
                  <input name="compare_price" type="number" value={form.compare_price} onChange={handleChange} placeholder="100000" />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Categoría
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="personajes">Personajes</option>
                    <option value="ropa">Ropa</option>
                    <option value="papeleria">Papelería</option>
                    <option value="casa">Casa</option>
                  </select>
                </label>
                <label>
                  Stock
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} min="0" />
                </label>
              </div>
              <label>
                Imágenes (nombres de archivo o URLs, separados por coma)
                <input
                  name="images"
                  value={form.images}
                  onChange={handleChange}
                  placeholder="card-personajes.webp"
                />
              </label>
              <label>
                Tallas / Tamaños (separados por coma)
                <input
                  name="sizes"
                  value={form.sizes}
                  onChange={handleChange}
                  placeholder="Mini, Mediano"
                />
              </label>
              <label className="checkbox-label">
                <input name="active" type="checkbox" checked={form.active} onChange={handleChange} />
                Activo (visible en tienda)
              </label>
              {error && <p className="form-error">{error}</p>}
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setModal(null)}>Cancelar</button>
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
