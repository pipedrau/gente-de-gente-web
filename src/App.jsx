import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import About from './pages/About'
import Contacto from './pages/Contacto'
import './styles.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/:category" element={<Shop />} />
      <Route path="/producto/:id" element={<Product />} />
      <Route path="/about" element={<About />} />
      <Route path="/contacto" element={<Contacto />} />
    </Routes>
  )
}
