import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Navbar() {
    const { cart } = useCart()
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    let user: any = {};
    try {
        const savedUser = localStorage.getItem('user');
        if (savedUser && savedUser !== 'undefined') {
            user = JSON.parse(savedUser);
        }
    } catch (e) {
        console.error("Failed to parse user", e);
        // Clear potentially corrupted data
        localStorage.removeItem('user');
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10 h-20">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                <Link to="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    LUMINA
                </Link>

                <div className="flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Library
                    </Link>

                    {!token ? (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-bold text-white hover:text-blue-400 transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors">
                                Sign Up
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            {/* Admin Link - Only show if role is admin */}
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
                                    Admin Portal
                                </Link>
                            )}

                            <Link to="/wishlist" className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group">
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                Wishlist
                            </Link>

                            <Link to="/profile" className="flex items-center gap-2 group">
                                <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors hidden sm:block">
                                    {user.name?.split(' ')[0]}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-transparent group-hover:border-white transition-all"></div>
                            </Link>

                            <div className="h-6 w-px bg-white/10"></div>

                            <div className="relative group cursor-pointer" onClick={() => navigate('/checkout')}>
                                <ShoppingCart className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-black">
                                        {cart.length}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={handleLogout}
                                className="text-xs font-bold text-gray-500 hover:text-white transition-colors"
                            >
                                LOGOUT
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
