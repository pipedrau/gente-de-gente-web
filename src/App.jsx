import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { useCart } from './context/CartContext'
import CartDrawer from './components/CartDrawer'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import About from './pages/About'
import Contacto from './pages/Contacto'
import Search from './pages/Search'
import Checkout from './pages/Checkout'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProductos from './pages/admin/Productos'
import AdminPedidos from './pages/admin/Pedidos'
import AdminCupones from './pages/admin/Cupones'
import './styles.css'

function AppContent() {
  useCart()
  return (
    <>
      <CartDrawer />
      <Routes>
        {/* Tienda */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:category" element={<Shop />} />
        <Route path="/producto/:id" element={<Product />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/buscar" element={<Search />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/productos" element={<ProtectedRoute><AdminProductos /></ProtectedRoute>} />
        <Route path="/admin/pedidos" element={<ProtectedRoute><AdminPedidos /></ProtectedRoute>} />
        <Route path="/admin/cupones" element={<ProtectedRoute><AdminCupones /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
