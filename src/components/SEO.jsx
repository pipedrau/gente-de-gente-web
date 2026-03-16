import { useEffect } from 'react'

export default function SEO({ title, description, image }) {
  useEffect(() => {
    document.title = title ? `${title} · Gente de Gente` : 'Gente de Gente — Diseño artesanal colombiano'

    const setMeta = (selector, content, attr = 'content') => {
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        const [attrName, attrVal] = selector.replace('meta[', '').replace(']', '').split('=')
        el.setAttribute(attrName, attrVal.replace(/"/g, ''))
        document.head.appendChild(el)
      }
      el.setAttribute(attr, content)
    }

    const desc = description || 'Personajes, ropa, papelería y objetos para el hogar. Diseño ilustrado artesanal colombiano.'
    const img = image || ''

    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', document.title)
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[property="og:type"]', 'website')
    if (img) setMeta('meta[property="og:image"]', img)
  }, [title, description, image])

  return null
}
