import { motion } from 'framer-motion';
import { Award, BookOpen, Star, Zap, Shield } from 'lucide-react';

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
    unlocked: boolean;
}

export default function BadgeShowcase() {
    // Simulated unlocking logic (in a real app, this would come from backend)
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    // Example logic: Unlocked if user exists (Novice), always unlocking others for demo
    const badges: Badge[] = [
        {
            id: 'novice',
            name: 'Novice Recruit',
            description: 'Joined the Lumina network.',
            icon: Shield,
            color: 'from-blue-400 to-blue-600',
            unlocked: !!user
        },
        {
            id: 'bookworm',
            name: 'Data Consumer',
            description: 'Added 2+ items to your library.',
            icon: BookOpen,
            color: 'from-purple-400 to-purple-600',
            unlocked: true // Demo: Auto-unlocked
        },
        {
            id: 'critic',
            name: 'Opinionated',
            description: 'Left a review on a book.',
            icon: Star,
            color: 'from-yellow-400 to-orange-500',
            unlocked: false // Demo: Locked
        },
        {
            id: 'legend',
            name: 'Cyber Legend',
            description: 'Completed 5 orders.',
            icon: Zap,
            color: 'from-red-500 to-pink-600',
            unlocked: false
        }
    ];

    return (
        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

            <div className="flex items-center gap-3 mb-8">
                <Award className="text-yellow-400" size={28} />
                <h2 className="text-2xl font-bold text-white">Achievements</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {badges.map((badge, index) => (
                    <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative group ${badge.unlocked ? 'opacity-100' : 'opacity-40 grayscale'}`}
                    >
                        {/* Hexagon/Badge Shape */}
                        <div className={`
                            relative h-32 w-full rounded-2xl bg-gradient-to-br ${badge.color} 
                            flex flex-col items-center justify-center p-4 
                            shadow-lg shadow-purple-900/20 border border-white/20
                            transition-transform group-hover:scale-105 group-hover:rotate-1
                        `}>
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <badge.icon size={32} className="text-white mb-2 drop-shadow-md" />
                            <span className="text-xs font-bold text-white text-center uppercase tracking-wider">{badge.name}</span>
                        </div>

                        {/* Tooltip */}
                        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-48 bg-black/90 text-white text-xs p-2 rounded-lg text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 border border-white/10">
                            {badge.description}
                            {!badge.unlocked && <p className="text-red-400 mt-1 font-bold">LOCKED</p>}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
