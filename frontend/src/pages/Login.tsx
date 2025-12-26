import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Login failed')

            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            window.dispatchEvent(new Event('storage'))
            navigate('/')
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <div className="min-h-screen flex text-white font-sans selection:bg-blue-500/30">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex flex-col justify-center p-12 w-1/2 bg-gradient-to-br from-blue-900 via-gray-900 to-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="relative z-10">
                    <h1 className="text-6xl font-black mb-6 leading-tight">
                        Welcome to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">LUMINA</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-md">Your gateway to infinite worlds. Sign in to access your digital library.</p>
                </div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl filter"></div>
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl filter"></div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-black">
                <div className="max-w-md w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="glass-panel p-10 rounded-3xl border border-white/10"
                    >
                        <h2 className="text-3xl font-bold mb-2 text-center">Sign In</h2>
                        <p className="text-gray-400 text-center mb-8">Enter your details to continue</p>

                        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 outline-none transition-all text-white placeholder-gray-600"
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
                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 outline-none transition-all text-white placeholder-gray-600"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98]">
                                Sign In
                            </button>
                        </form>

                        <p className="mt-8 text-center text-gray-400 text-sm">
                            New to Lumina? <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">Create account</Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

