import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { useCart } from './context/CartContext'
import CartDrawer from './components/CartDrawer'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import About from './pages/About'
import Contacto from './pages/Contacto'
import Search from './pages/Search'
import NotFound from './pages/NotFound'
import './styles.css'

function AppContent() {
  useCart() // ensures context is accessible
  return (
    <>
      <CartDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:category" element={<Shop />} />
        <Route path="/producto/:id" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/buscar" element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ErrorBoundary>
  )
}
