import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

interface Book {
    _id: string;
    title: string;
    author: string;
    price: number;
    description: string;
}

export default function Wishlist() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = () => {
        fetch('http://localhost:4000/api/user/wishlist', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => {
                setBooks(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const removeFromWishlist = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await fetch(`http://localhost:4000/api/user/wishlist/${id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        fetchWishlist();
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-pink-500/30">
            <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
            <Navbar />

            <div className="container mx-auto px-4 pt-28 pb-12 relative z-10">
                <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
                    <Heart className="text-pink-500 fill-pink-500" size={32} />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-white">Your Wishlist</span>
                </h2>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading...</div>
                ) : books.length === 0 ? (
                    <div className="glass-panel p-16 rounded-3xl text-center border border-white/10 max-w-2xl mx-auto">
                        <Heart className="mx-auto h-16 w-16 text-gray-700 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-400">Save items you love for later!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {books.map((book, i) => (
                            <motion.div
                                key={book._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full cursor-pointer relative"
                                onClick={() => window.location.href = `/book/${book._id}`}
                            >
                                <button
                                    onClick={(e) => removeFromWishlist(book._id, e)}
                                    className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-red-500 p-2 rounded-full text-white backdrop-blur-sm transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                                    <span className="text-5xl filter drop-shadow-lg">📖</span>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-white line-clamp-1">{book.title}</h3>
                                        <p className="text-xs text-gray-400 font-medium uppercase">{book.author}</p>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                        <span className="text-xl font-bold text-white">${book.price}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(book);
                                            }}
                                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                                        >
                                            <ShoppingCart className="w-3 h-3" /> Add
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
