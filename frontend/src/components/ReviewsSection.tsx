import { useState } from 'react';
import { Star, MessageCircle } from 'lucide-react';

interface Review {
    user: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function ReviewsSection({ bookId, reviews = [] }: { bookId: string, reviews: Review[] }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [localReviews, setLocalReviews] = useState(reviews);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:4000/api/books/${bookId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ rating, comment })
            });
            const updatedBook = await res.json();
            setLocalReviews(updatedBook.reviews);
            setComment('');
        } catch (err) {
            console.error('Failed to post review');
        }
    };

    return (
        <div className="mt-16 border-t border-white/10 pt-10">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <MessageCircle className="text-blue-500" /> Community Reviews
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Review List */}
                <div className="space-y-6">
                    {localReviews.length === 0 ? (
                        <p className="text-gray-500 italic">No reviews yet. Be the first!</p>
                    ) : (
                        localReviews.map((rev, i) => (
                            <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-white">{rev.user}</span>
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-current"
                                                style={{ opacity: i < rev.rating ? 1 : 0.2 }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">{rev.comment}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Review Form */}
                <div className="glass-panel p-8 rounded-2xl border border-white/10 h-fit">
                    <h4 className="font-bold text-white mb-4">Write a Review</h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`transition-all hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                                    >
                                        <Star className="w-6 h-6 fill-current" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Comment</label>
                            <textarea
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none text-sm"
                                rows={4}
                                placeholder="What did you think?"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                            Post Review
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
