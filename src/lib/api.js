import { supabase } from './supabase'

const BASE_URL = import.meta.env.BASE_URL

// Resuelve nombre de archivo local o URL completa de Supabase Storage
const resolveImage = (img) => {
  if (!img) return `${BASE_URL}assets/card-personajes.webp`
  if (img.startsWith('http')) return img
  return `${BASE_URL}assets/${img}`
}

export const formatPrice = (n) =>
  `$${Number(n).toLocaleString('es-CO')} COP`

export const normalizeProduct = (p) => ({
  id: p.id,
  name: p.name,
  cat: p.category,
  price: formatPrice(p.price),
  priceNum: p.price,
  img: resolveImage(p.images?.[0]),
  images: (p.images || []).map(resolveImage),
  description: p.description || '',
  sizes: p.sizes || ['Mini', 'Mediano'],
  stock: p.stock ?? 0,
  compare_price: p.compare_price,
  active: p.active,
})

export async function getProducts(category) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
  if (category && category !== 'todo') {
    query = query.eq('category', category)
  }
  const { data, error } = await query
  if (error) throw error
  return data.map(normalizeProduct)
}

export async function getProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .single()
  if (error) throw error
  return normalizeProduct(data)
}

export async function searchProducts(q) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .or(`name.ilike.%${q}%,category.ilike.%${q}%,description.ilike.%${q}%`)
  if (error) throw error
  return data.map(normalizeProduct)
}

export async function validateCoupon(code, subtotal) {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('active', true)
    .single()

  if (error || !data) return { valid: false, message: 'Cupón no válido' }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, message: 'Este cupón ha expirado' }
  }

  if (subtotal < data.min_purchase) {
    return {
      valid: false,
      message: `Compra mínima ${formatPrice(data.min_purchase)}`,
    }
  }

  const discount =
    data.type === 'percent'
      ? Math.round((subtotal * data.value) / 100)
      : Math.min(data.value, subtotal)

  return {
    valid: true,
    discount,
    message: `Cupón aplicado: -${data.type === 'percent' ? `${data.value}%` : formatPrice(data.value)}`,
    coupon: data,
  }
}

export async function createOrder(orderData) {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single()
  if (error) throw error
  return data
}
