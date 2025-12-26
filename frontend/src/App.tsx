import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Checkout from './pages/Checkout'
import BookDetails from './pages/BookDetails'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import Wishlist from './pages/Wishlist'
import AiConcierge from './components/AiConcierge'
import PromoBanner from './components/PromoBanner'

function App() {
  return (
    <Router>
      <PromoBanner />
      <CartProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
        <AiConcierge />
      </CartProvider>
    </Router>
  )
}

export default App
