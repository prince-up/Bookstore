import { motion } from 'framer-motion';
import { Flame, Clock, TrendingUp } from 'lucide-react';

interface DailyDealProps {
    onViewDeal: () => void;
}

export default function DailyDeal({ onViewDeal }: DailyDealProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 rounded-3xl p-8 overflow-hidden shadow-2xl mb-12"
        >
            {/* Animated background */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"
            ></motion.div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <Flame className="text-yellow-300 animate-pulse" size={28} />
                        <span className="text-yellow-300 font-bold text-sm uppercase tracking-wider">Deal of the Day</span>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-2">50% OFF Today Only!</h3>
                    <p className="text-white/90 text-lg mb-4">Featured Book: <span className="font-bold">"The Great Gatsby"</span></p>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg">
                            <Clock className="text-white" size={18} />
                            <span className="text-white font-mono font-bold">23:59:42</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                            <TrendingUp size={16} />
                            <span>143 claimed today</span>
                        </div>
                    </div>

                    <button
                        onClick={onViewDeal}
                        className="bg-white hover:bg-gray-100 text-red-600 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Claim Deal Now →
                    </button>
                </div>

                <div className="relative">
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-48 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center"
                    >
                        <div className="text-white text-center">
                            <div className="text-6xl mb-2">📚</div>
                            <div className="text-sm font-bold">FEATURED</div>
                        </div>
                    </motion.div>
                    <div className="absolute -top-4 -right-4 bg-yellow-400 text-black font-black text-xl px-4 py-2 rounded-full shadow-lg rotate-12">
                        -50%
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
