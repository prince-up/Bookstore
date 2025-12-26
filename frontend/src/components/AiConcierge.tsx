import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

export default function AiConcierge() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Greetings! I am Lumina, your AI literary guide. How can I assist your journey today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking and response
        setTimeout(() => {
            const botResponse = generateResponse(userMsg.text);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
            setIsTyping(false);
        }, 1500);
    };

    const generateResponse = (text: string): string => {
        const lower = text.toLowerCase();
        if (lower.includes('hello') || lower.includes('hi')) return "Hello! Looking for a specific genre today?";
        if (lower.includes('recommend') || lower.includes('suggest')) {
            if (lower.includes('scifi') || lower.includes('sci-fi')) return "For Sci-Fi, 'Dune' is a masterpiece. Also check out 'Neuromancer' for cyberpunk vibes!";
            if (lower.includes('romance')) return "Our romance collection is lovely. 'Pride and Prejudice' is a timeless classic.";
            return "I can recommend books based on genre. Try asking for 'Sci-Fi' or 'Mystery'!";
        }
        if (lower.includes('price') || lower.includes('cost')) return "We offer competitive pricing on all premium editions. Check the book details for specific costs.";
        if (lower.includes('shipping') || lower.includes('delivery')) return "We offer instant digital delivery for e-books and 2-day shipping for physical copies.";
        if (lower.includes('sad') || lower.includes('depress')) return "I'm sorry to hear that. Maybe a comforting book like 'The Little Prince' or 'Harry Potter' could lift your spirits? 🌟";
        if (lower.includes('happy')) return "Great! Keep the energy high with 'The Hitchhiker's Guide to the Galaxy'. It's hilarious!";

        return "I'm still learning! Try asking for recommendations or genre specific questions.";
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[350px] h-[500px] glass-panel rounded-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden bg-black/80 backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/20 rounded-full">
                                    <Bot size={20} className="text-white" />
                                </div>
                                <span className="font-bold text-white">Lumina AI</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none border border-white/5 flex gap-1">
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-gray-400 rounded-full"></motion.div>
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-gray-400 rounded-full"></motion.div>
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-gray-400 rounded-full"></motion.div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask for a book..."
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors disabled:opacity-50"
                                    disabled={!input.trim()}
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/30 flex items-center justify-center text-white relative group"
            >
                <div className="absolute inset-0 rounded-full bg-white/20 blur-md group-hover:blur-lg transition-all"></div>
                {isOpen ? <X size={24} className="relative z-10" /> : <MessageCircle size={24} className="relative z-10" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-pulse"></span>
                )}
            </motion.button>
        </div>
    );
}
