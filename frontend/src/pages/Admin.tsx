import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Plus, Trash2, Edit2, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Book {
    _id: string;
    title: string;
    author: string;
    price: number;
    description: string;
}

export default function Admin() {
    const [books, setBooks] = useState<Book[]>([]);
    const [isEditing, setIsEditing] = useState<Book | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ title: '', author: '', price: '', description: '' });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = () => {
        fetch('http://localhost:4000/api/books')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setBooks(data);
                } else {
                    console.error('Expected array, got:', data);
                    setBooks([]);
                }
            })
            .catch(err => console.error(err));
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        await fetch(`http://localhost:4000/api/books/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        fetchBooks();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEditing
            ? `http://localhost:4000/api/books/${isEditing._id}`
            : 'http://localhost:4000/api/books';
        const method = isEditing ? 'PUT' : 'POST';

        await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });

        setIsEditing(null);
        setIsCreating(false);
        setFormData({ title: '', author: '', price: '', description: '' });
        fetchBooks();
    };

    const openEdit = (book: Book) => {
        setIsEditing(book);
        setFormData({
            title: book.title,
            author: book.author,
            price: book.price.toString(),
            description: book.description
        });
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-red-500/30">
            <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
            <Navbar />

            <div className="container mx-auto px-4 pt-28 pb-12 relative z-10">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                        Admin Command Center
                    </h1>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-900/40"
                    >
                        <Plus className="w-5 h-5" /> Add New Book
                    </button>
                </div>

                <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10 uppercase text-xs text-gray-400 font-bold tracking-wider">
                            <tr>
                                <th className="p-6">Title</th>
                                <th className="p-6">Author</th>
                                <th className="p-6">Price</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {books.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-10 text-center text-gray-400">
                                        No books found. Click "Add New Book" to start!
                                    </td>
                                </tr>
                            ) : (
                                books.map(book => (
                                    <tr key={book._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-6 font-medium text-white">{book.title}</td>
                                        <td className="p-6 text-gray-400">{book.author}</td>
                                        <td className="p-6 text-green-400 font-mono">${book.price}</td>
                                        <td className="p-6 text-right space-x-4">
                                            <button onClick={() => openEdit(book)} className="text-blue-400 hover:text-white transition-colors"><Edit2 className="w-5 h-5" /></button>
                                            <button onClick={() => handleDelete(book._id)} className="text-red-400 hover:text-white transition-colors"><Trash2 className="w-5 h-5" /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Edit/Create */}
            <AnimatePresence>
                {(isEditing || isCreating) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass-panel p-8 rounded-3xl w-full max-w-lg border border-white/20"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">{isEditing ? 'Edit Book' : 'Add New Book'}</h2>
                                <button onClick={() => { setIsEditing(null); setIsCreating(false); }} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Title</label>
                                    <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-red-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Author</label>
                                    <input value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-red-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Price</label>
                                    <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-red-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-red-500 outline-none h-32" />
                                </div>
                                <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-red-900/40">
                                    <Save className="w-5 h-5 inline mr-2" /> Save Changes
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
