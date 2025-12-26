import { useEffect, useState } from 'react'
// import ThreeHero from '../components/ThreeHero'
import Navbar from '../components/Navbar'
import { useCart } from '../context/CartContext'
import { motion } from 'framer-motion'
import { ShoppingCart, Sparkles } from 'lucide-react'
import SocialProof from '../components/SocialProof'
import DailyDeal from '../components/DailyDeal'
import BookFinderQuiz from '../components/BookFinderQuiz'

interface Book {
    _id: string
    title: string
    author: string
    price: number
    description: string
}

export default function Dashboard() {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [isQuizOpen, setIsQuizOpen] = useState(false)
    const { addToCart } = useCart()

    const categories = ['All', 'Fiction', 'Sci-Fi', 'Business', 'Romance']

    useEffect(() => {
        fetchBooks(search, category)
    }, [category])

    const fetchBooks = (q = '', cat = 'All') => {
        setLoading(true)
        let url = `http://localhost:4000/api/books?`
        if (q) url += `search=${encodeURIComponent(q)}&`
        if (cat && cat !== 'All') url += `category=${encodeURIComponent(cat)}`

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setBooks(data)
                } else {
                    console.error('Expected array of books, got:', data)
                    setBooks([])
                }
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to fetch books', err)
                setLoading(false)
            })
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchBooks(search, category)
    }

    const addToWishlist = async (e: React.MouseEvent, bookId: string) => {
        e.stopPropagation();
        try {
            await fetch(`http://localhost:4000/api/user/wishlist/${bookId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Wishlist updated!');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="min-h-screen bg-transparent text-gray-100 font-sans selection:bg-blue-500/30">
            <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 h-full w-full"></div>

            <Navbar />

            <main className="container mx-auto px-4 pt-28 pb-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    {/* <ThreeHero /> */}
                    <div className="h-[300px] w-full bg-gradient-to-r from-blue-900 to-purple-900 rounded-3xl flex items-center justify-center border border-white/10">
                        <div className="text-center">
                            <h1 className="text-5xl font-bold text-white mb-4">LUMINA</h1>
                            <p className="text-gray-300">Your premium library awaiting.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Social Proof Widgets */}
                <SocialProof />

                {/* Daily Deal Spotlight */}
                <DailyDeal onViewDeal={() => setCategory('Fiction')} />

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                    <div className="flex-1">
                        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6">
                            Trending Collection
                        </h2>
                        <button
                            onClick={() => setIsQuizOpen(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-pink-500/30"
                        >
                            <Sparkles size={20} />
                            Find Your Perfect Book
                        </button>
                    </div>

                        {/* Category Tabs */}
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${category === cat
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
                        <input
                            type="text"
                            placeholder="Search titles or authors..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 pl-12 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-white placeholder-gray-500"
                        />
                        <svg className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </form>
                </div>

                <div className="h-px bg-white/20 w-full mb-8"></div>

                {
        loading ? (
            <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-400 animate-pulse">Loading library...</p>
            </div>
        ) : books.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-white mb-2">Library is Empty</h3>
                <p className="text-gray-400">Our shelves are currently being stocked. Please check back soon!</p>
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
                            onClick={(e) => addToWishlist(e, book._id)}
                            className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-red-500/80 p-2 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        </button>

                        <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors"></div>
                            <span className="text-6xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-500">📖</span>
                            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">{book.title}</h3>
                            <p className="text-gray-400 text-sm mb-4">{book.author}</p>
                            <p className="text-gray-500 text-xs mb-4 line-clamp-2 flex-1">{book.description}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <span className="text-2xl font-bold text-white neon-text">${book.price}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(book);
                                    }}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-900/40 hover:shadow-blue-500/40 active:scale-95 z-20"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    loading ? (
                                    <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center justify-center">
                                        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                                        <p className="text-gray-400 animate-pulse">Loading library...</p>
                                    </div>
                                    ) : books.length === 0 ? (
                                    <div className="glass-panel p-12 rounded-3xl text-center">
                                        <div className="text-6xl mb-4">📚</div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Library is Empty</h3>
                                        <p className="text-gray-400">Our shelves are currently being stocked. Please check back soon!</p>
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
                                                    onClick={(e) => addToWishlist(e, book._id)}
                                                    className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-red-500/80 p-2 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                                </button>

                                                <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors"></div>
                                                    <span className="text-6xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-500">📖</span>
                                                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
                                                </div>

                                                <div className="p-6 flex-1 flex flex-col">
                                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">{book.title}</h3>
                                                    <p className="text-gray-400 text-sm mb-4">{book.author}</p>
                                                    <p className="text-gray-500 text-xs mb-4 line-clamp-2 flex-1">{book.description}</p>

                                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                        <span className="text-2xl font-bold text-white neon-text">${book.price}</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addToCart(book);
                                                            }}
                                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-900/40 hover:shadow-blue-500/40 active:scale-95 z-20"
                                                        >
                                                            <ShoppingCart className="w-4 h-4" />
                                                            Add
                                                            Add
                                                        </button>
                                                    </div>
                                                    )
}
