import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

// Replace with your publishable key
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { cart, total, clearCart } = useCart();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setProcessing(true);

        const cardElement = elements.getElement(CardElement);

        try {
            const response = await fetch('http://localhost:4000/api/payment/create-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ amount: total }),
            });

            const { clientSecret, error: backendError } = await response.json();

            if (backendError) {
                setError(backendError);
                setProcessing(false);
                return;
            }

            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement!,
                },
            });

            if (stripeError) {
                setError(stripeError.message || 'Payment failed');
            } else if (paymentIntent.status === 'succeeded') {
                await fetch('http://localhost:4000/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        items: cart.map((item: any) => ({
                            book: item._id,
                            quantity: item.quantity,
                            title: item.title,
                            price: item.price
                        })),
                        total,
                        status: 'Paid'
                    })
                });

                clearCart();
                alert('Payment Successful!');
                navigate('/dashboard');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            console.error(err);
        }

        setProcessing(false);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back to Library
            </button>

            <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>

                <h2 className="text-3xl font-bold mb-8 text-white">Secure Checkout</h2>

                <div className="mb-8">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-gray-400">Total Amount</span>
                        <span className="text-4xl font-bold text-white neon-text">${total.toFixed(2)}</span>
                    </div>

                    <div className="p-4 border border-white/10 rounded-xl bg-black/40">
                        <CardElement options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#ffffff',
                                    '::placeholder': {
                                        color: '#6b7280',
                                    },
                                    iconColor: '#60a5fa'
                                },
                                invalid: {
                                    color: '#ef4444',
                                },
                            },
                        }} />
                    </div>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm flex items-center gap-2">⚠️ {error}</div>}

                <button
                    type="submit"
                    disabled={!stripe || processing}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                            Processing...
                        </span>
                    ) : 'Confirm Payment'}
                </button>
            </form>
        </div>
    );
};

export default function Checkout() {
    return (
        <Elements stripe={stripePromise}>
            <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
                <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
                <Navbar />
                <div className="container mx-auto px-4 pt-32 pb-12 relative z-10">
                    <CheckoutForm />
                </div>
            </div>
        </Elements>
    );
}
