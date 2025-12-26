import { useState, useEffect } from 'react';
import { X, Gift, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PromoBanner() {
    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return prev;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                exit={{ y: -100 }}
                className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white py-3 px-4 shadow-lg"
            >
                <div className="container mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <Gift className="w-6 h-6 animate-pulse" />
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <span className="font-bold text-sm sm:text-base">
                                🎉 NEW USER SPECIAL: 20% OFF YOUR FIRST ORDER
                            </span>
                            <span className="text-xs sm:text-sm bg-white/20 px-3 py-1 rounded-full font-mono">
                                Code: LUMINA20
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg">
                            <Clock className="w-4 h-4" />
                            <span className="font-mono text-sm">
                                {String(timeLeft.hours).padStart(2, '0')}:
                                {String(timeLeft.minutes).padStart(2, '0')}:
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
