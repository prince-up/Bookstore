import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Signup() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:4000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Signup failed')

            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            window.dispatchEvent(new Event('storage'))
            navigate('/dashboard')
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <div className="min-h-screen flex text-white font-sans selection:bg-green-500/30">
            {/* Right Side - Form (Left side on signup for variety) */}
            <div className="flex-1 flex items-center justify-center p-8 bg-black">
                <div className="max-w-md w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="glass-panel p-10 rounded-3xl border border-white/10"
                    >
                        <h2 className="text-3xl font-bold mb-2 text-center text-white">Join Lumina</h2>
                        <p className="text-gray-400 text-center mb-8">Start your reading journey today</p>

                        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-green-500 focus:bg-white/10 outline-none transition-all text-white placeholder-gray-600"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-green-500 focus:bg-white/10 outline-none transition-all text-white placeholder-gray-600"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-green-500 focus:bg-white/10 outline-none transition-all text-white placeholder-gray-600"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-green-900/40 hover:scale-[1.02] active:scale-[0.98]">
                                Create Account
                            </button>
                        </form>

                        <p className="mt-8 text-center text-gray-400 text-sm">
                            Already have an account? <Link to="/login" className="text-green-400 hover:text-green-300 font-medium hover:underline">Sign in</Link>
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Left Side - Decorative */}
            <div className="hidden lg:flex flex-col justify-center p-12 w-1/2 bg-gradient-to-bl from-green-900 via-gray-900 to-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="relative z-10 text-right">
                    <h1 className="text-6xl font-black mb-6 leading-tight">
                        Expand Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-l from-green-400 to-teal-500">HORIZONS</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-md ml-auto">Join a community of readers and explore curated collections in 3D.</p>
                </div>
                <div className="absolute top-24 left-24 w-72 h-72 bg-green-600/20 rounded-full blur-3xl filter"></div>
            </div>
        </div>
    )
}

