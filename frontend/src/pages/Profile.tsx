import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import BadgeShowcase from '../components/BadgeShowcase';
import { Package, User as UserIcon } from 'lucide-react';

interface OrderItem {
    title: string;
    price: number;
    quantity: number;
}

interface Order {
    _id: string;
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

export default function Profile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:4000/api/orders/my-orders', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setOrders(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-blue-500/30">
            <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
            <Navbar />

            <div className="container mx-auto px-4 pt-28 pb-12 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* User Card */}
                    <div className="md:w-1/3">
                        <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-xl shadow-blue-900/40">
                                {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-10 h-10" />}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
                            <p className="text-gray-400 mb-6">{user.email}</p>
                            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                                Member
                            </div>
                        </div>

                        <div className="mt-8">
                            <BadgeShowcase />
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="md:w-2/3">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Package className="text-blue-500" /> Order History
                        </h3>

                        {loading ? (
                            <div className="text-center py-10 text-gray-500">Loading orders...</div>
                        ) : orders.length === 0 ? (
                            <div className="glass-panel p-10 rounded-2xl text-center text-gray-500">
                                No orders found. Start your library today!
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order._id} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-sm text-gray-400">Order ID: <span className="font-mono text-gray-500">#{order._id.slice(-6)}</span></p>
                                                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Paid' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="text-gray-300">{item.title} x{item.quantity}</span>
                                                    <span className="text-gray-500">${item.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-white/5 flex justify-end">
                                            <span className="text-xl font-bold text-white">${order.total}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
