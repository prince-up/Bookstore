import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';

interface QuizProps {
    isOpen: boolean;
    onClose: () => void;
}

const moods = [
    { emoji: '😊', label: 'Happy', genre: 'Romance' },
    { emoji: '😢', label: 'Sad', genre: 'Fiction' },
    { emoji: '🤔', label: 'Curious', genre: 'Mystery' },
    { emoji: '🚀', label: 'Adventurous', genre: 'Sci-Fi' }
];

const vibes = [
    { emoji: '💕', label: 'Romance', category: 'Romance' },
    { emoji: '🔍', label: 'Mystery', category: 'Mystery' },
    { emoji: '🚀', label: 'Adventure', category: 'Sci-Fi' },
    { emoji: '🧠', label: 'Mind-bending', category: 'Fiction' }
];

export default function BookFinderQuiz({ isOpen, onClose }: QuizProps) {
    const [step, setStep] = useState(1);
    const [selectedMood, setSelectedMood] = useState('');
    const [selectedVibe, setSelectedVibe] = useState('');

    const recommendations: Record<string, { title: string; author: string; reason: string }> = {
        'Romance': { title: 'Pride and Prejudice', author: 'Jane Austen', reason: 'A timeless love story' },
        'Fiction': { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', reason: 'Deep and thought-provoking' },
        'Mystery': { title: 'The Catcher in the Rye', author: 'J.D. Salinger', reason: 'Intriguing and mysterious' },
        'Sci-Fi': { title: 'Dune', author: 'Frank Herbert', reason: 'Epic space adventure' }
    };

    const handleMoodSelect = (genre: string) => {
        setSelectedMood(genre);
        setStep(2);
    };

    const handleVibeSelect = (category: string) => {
        setSelectedVibe(category);
        setStep(3);
    };

    const getRecommendation = () => {
        return recommendations[selectedVibe] || recommendations[selectedMood] || recommendations['Fiction'];
    };

    const reset = () => {
        setStep(1);
        setSelectedMood('');
        setSelectedVibe('');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <Sparkles className="text-yellow-400" size={28} />
                            <h2 className="text-3xl font-bold text-white">Find Your Perfect Book</h2>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-8 bg-white/5 rounded-full h-2 overflow-hidden">
                            <motion.div
                                initial={{ width: '0%' }}
                                animate={{ width: `${(step / 3) * 100}%` }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            />
                        </div>

                        {/* Step 1: Mood */}
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-xl text-gray-300 mb-6">How are you feeling today?</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {moods.map((mood) => (
                                        <button
                                            key={mood.label}
                                            onClick={() => handleMoodSelect(mood.genre)}
                                            className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500 rounded-2xl transition-all group"
                                        >
                                            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{mood.emoji}</div>
                                            <div className="text-lg font-semibold text-white">{mood.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Vibe */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-xl text-gray-300 mb-6">What's your vibe?</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {vibes.map((vibe) => (
                                        <button
                                            key={vibe.label}
                                            onClick={() => handleVibeSelect(vibe.category)}
                                            className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500 rounded-2xl transition-all group"
                                        >
                                            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{vibe.emoji}</div>
                                            <div className="text-lg font-semibold text-white">{vibe.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Result */}
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <div className="mb-6">
                                    <div className="text-6xl mb-4">📚</div>
                                    <h3 className="text-2xl font-bold text-white mb-2">We recommend:</h3>
                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl mt-4">
                                        <h4 className="text-3xl font-bold text-white mb-2">{getRecommendation().title}</h4>
                                        <p className="text-blue-100 text-lg mb-2">by {getRecommendation().author}</p>
                                        <p className="text-sm text-blue-200">{getRecommendation().reason}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={reset}
                                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl transition-all flex items-center gap-2"
                                    >
                                        Browse Books <ArrowRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
