import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Type, Sun, Moon, Coffee } from 'lucide-react';

interface ReadingNookProps {
    isOpen: boolean;
    onClose: () => void;
    bookTitle: string;
    chapterContent?: string;
}

const DUMMY_TEXT = `The sky above the port was the color of television, tuned to a dead channel. It's not like I'm using,' Case heard someone say, as he shouldered his way through the crowd around the door of the Chat. 'It's like my body's developed this massive drug deficiency.'

It was a Sprawl voice and a Sprawl joke. The Chatsubo was a bar for professional expatriates; you could drink there for a week and never hear two words in Japanese.

Case found a place at the bar, between the unlikely tan on one of Lonny Zone's whores and the crisp naval uniform of a tall African with rigid cheekbones. The bartender was a prosthetic arm jerking monotonically. Case watched his drink arrive.

This was the future, or a version of it. Neon rain slicked the streets, reflecting holograms of corporate logos that towered into the smog. He took a sip. It tasted like synthesized regret.

He turned the page, metaphorically speaking. The data stream in his head was quiet for once. No incoming messages, no urgent contracts. Just the hum of the city and the weight of the story unfolding before him...`;

export default function ReadingNook({ isOpen, onClose, bookTitle, chapterContent = DUMMY_TEXT }: ReadingNookProps) {
    const [theme, setTheme] = useState<'dark' | 'light' | 'sepia'>('dark');
    const [fontSize, setFontSize] = useState(18);

    const themes = {
        dark: 'bg-gray-900 text-gray-300',
        light: 'bg-white text-gray-800',
        sepia: 'bg-[#f4ecd8] text-[#5b4636]',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex flex-col"
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>

                    {/* Reader Container */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`relative w-full max-w-4xl mx-auto h-full shadow-2xl overflow-hidden flex flex-col ${themes[theme]}`}
                    >
                        {/* Toolbar */}
                        <div className="flex items-center justify-between p-6 border-b border-black/10 bg-inherit z-10">
                            <h2 className="text-xl font-serif font-bold truncate">{bookTitle} - Preview</h2>

                            <div className="flex items-center gap-6">
                                {/* Theme Toggles */}
                                <div className="flex bg-black/10 rounded-full p-1 gap-1">
                                    <button onClick={() => setTheme('light')} className={`p-2 rounded-full transition-all ${theme === 'light' ? 'bg-white shadow' : 'hover:bg-white/50'}`}><Sun size={18} /></button>
                                    <button onClick={() => setTheme('sepia')} className={`p-2 rounded-full transition-all ${theme === 'sepia' ? 'bg-[#e3d8c0] shadow' : 'hover:bg-white/50'}`}><Coffee size={18} /></button>
                                    <button onClick={() => setTheme('dark')} className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-gray-800 text-white shadow' : 'hover:bg-black/20'}`}><Moon size={18} /></button>
                                </div>

                                {/* Font Size */}
                                <div className="flex items-center gap-2">
                                    <Type size={16} />
                                    <input
                                        type="range"
                                        min="14"
                                        max="24"
                                        value={fontSize}
                                        onChange={(e) => setFontSize(Number(e.target.value))}
                                        className="w-24 accent-blue-500"
                                    />
                                </div>

                                <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-16 scrollbar-hide">
                            <div
                                className="max-w-2xl mx-auto font-serif leading-loose transition-all duration-300"
                                style={{ fontSize: `${fontSize}px` }}
                            >
                                <h3 className="text-3xl font-bold mb-8 text-center">Chapter 1</h3>
                                {chapterContent.split('\n\n').map((para, i) => (
                                    <p key={i} className="mb-6 indent-8 text-justify">
                                        {para}
                                    </p>
                                ))}
                                <p className="text-center italic opacity-50 mt-12">
                                    — End of Preview —
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-black/10 text-center text-sm opacity-60">
                            <p>Reading Mode Active • {fontSize}px</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
