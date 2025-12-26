import { useEffect, useState } from 'react';
import { TrendingUp, Users, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SocialProof() {
    const [onlineUsers, setOnlineUsers] = useState(127);
    const [viewingNow, setViewingNow] = useState(23);

    useEffect(() => {
        // Simulate fluctuating numbers
        const interval = setInterval(() => {
            setOnlineUsers(prev => prev + Math.floor(Math.random() * 10 - 5));
            setViewingNow(prev => Math.max(15, prev + Math.floor(Math.random() * 6 - 3)));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-wrap items-center gap-4 mb-8">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full"
            >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <Users size={16} className="text-green-400" />
                <span className="text-sm text-green-300 font-medium">{onlineUsers} readers online</span>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full"
            >
                <Eye size={16} className="text-blue-400" />
                <span className="text-sm text-blue-300 font-medium">{viewingNow} viewing this page</span>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full"
            >
                <TrendingUp size={16} className="text-yellow-400" />
                <span className="text-sm text-yellow-300 font-medium">⭐ 4.9/5 from 2,341 reviews</span>
            </motion.div>
        </div>
    );
}
