import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Float, Stars, Sparkles } from '@react-three/drei'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Heart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'
import Navbar from '../components/Navbar'
import ReviewsSection from '../components/ReviewsSection'
import ReadingNook from '../components/ReadingNook'

interface Book {
    _id: string
    title: string
    author: string
    description: string
    price: number
    reviews: any[]
}

function FloatingBookCover() {
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh rotation={[0, 0.5, 0]}>
                <boxGeometry args={[3, 4.5, 0.4]} />
                <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.5} />
            </mesh>
            <mesh position={[0.1, 0, 0]} scale={[0.98, 0.95, 1.02]}>
                <boxGeometry args={[2.8, 4.3, 0.35]} />
                <meshStandardMaterial color="#f1f5f9" />
            </mesh>
        </Float>
    );
}

export default function BookDetails() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [book, setBook] = useState<Book | null>(null)
    const [isReading, setIsReading] = useState(false)
    const { addToCart } = useCart()

    useEffect(() => {
        fetch(`http://localhost:4000/api/books/${id}`)
            .then(res => res.json())
            .then(data => setBook(data))
            .catch(err => console.error('Failed to fetch book', err))
    }, [id])

    const addToWishlist = async () => {
        try {
            await fetch(`http://localhost:4000/api/user/wishlist/${id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Added to wishlist!');
        } catch (err) {
            console.error(err);
        }
    }

    if (!book) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-blue-500/30">
            <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 h-full w-full"></div>
            <Navbar />

            <div className="container mx-auto px-4 pt-32 pb-12 relative z-10">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Library
                </button>

                <div className="flex flex-col lg:flex-row gap-12 mb-16">
                    {/* Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 lg:max-w-xl h-[500px]"
                    >
                        <div className="h-full w-full relative rounded-3xl overflow-hidden glass-panel border border-white/10">
                            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                                <ambientLight intensity={0.5} />
                                <pointLight position={[10, 10, 10]} intensity={1} color="#60a5fa" />
                                <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade />
                                <Sparkles count={100} scale={5} size={2} speed={0.4} opacity={0.5} color="#60a5fa" />
                                <FloatingBookCover />
                            </Canvas>
                        </div>
                    </motion.div>

                    {/* Info Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 space-y-8"
                    >
                        <div>
                            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-4">{book.title}</h1>
                            <p className="text-xl text-blue-400 font-medium tracking-wide uppercase">{book.author}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-bold text-white neon-text">${book.price}</span>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="fill-current w-5 h-5" />
                                <span className="text-white font-medium ml-2">4.8 (120 reviews)</span>
                            </div>
                        </div>

                        <p className="text-gray-300 text-lg leading-relaxed border-l-4 border-blue-500 pl-6">
                            {book.description}
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => addToCart(book)}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40 hover:shadow-blue-500/40 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
                            <button
                                onClick={addToWishlist}
                                className="bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-xl font-bold transition-all border border-white/10 flex items-center justify-center gap-2"
                            >
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Preview Button */}
                        <button
                            onClick={() => setIsReading(true)}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-pink-500/30 flex items-center justify-center gap-2"
                        >
                            Open Reading Nook (Preview)
                        </button>
                    </motion.div>
                </div>

                <ReviewsSection bookId={book._id} reviews={book.reviews} />
                <ReadingNook isOpen={isReading} onClose={() => setIsReading(false)} bookTitle={book.title} />
            </div>
        </div>
    );
}
