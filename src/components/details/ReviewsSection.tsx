import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus } from 'lucide-react';
import { Review } from '../../types';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { reviewsApi } from '../../api';

interface ReviewsSectionProps {
  bookId: string;
  reviews: Review[];
  onReviewAdded?: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  bookId,
  reviews,
  onReviewAdded,
}) => {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await reviewsApi.createReview(bookId, {
        rating,
        title,
        comment,
      });
      setTitle('');
      setComment('');
      setIsFormOpen(false);
      if (onReviewAdded) onReviewAdded();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#071A17] rounded-2xl border border-[#DDE8E1] dark:border-white/10 p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-white/10">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#202522] dark:text-white">Reader Reviews</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Verified reflections from readers worldwide</p>
        </div>

        {isAuthenticated && !isFormOpen && (
          <Button variant="outline" size="sm" onClick={() => setIsFormOpen(true)}>
            <MessageSquarePlus className="w-3.5 h-3.5 mr-1" />
            Write a Review
          </Button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-4 bg-stone-50 dark:bg-white/5 rounded-xl border border-[#DDE8E1] dark:border-white/10 space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans font-semibold text-[#202522] dark:text-white">Rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-[#C6A15B]"
                >
                  <Star className={`w-4 h-4 ${star <= rating ? 'fill-[#C6A15B]' : 'text-stone-300 dark:text-stone-600'}`} />
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Review Title (optional)..."
            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-[#DDE8E1] dark:border-white/10 rounded-lg text-xs text-[#202522] dark:text-white focus:outline-none focus:border-[#077432]"
          />

          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your spiritual or intellectual reflections on this book..."
            required
            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-[#DDE8E1] dark:border-white/10 rounded-lg text-xs text-[#202522] dark:text-white focus:outline-none focus:border-[#077432]"
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Submit Review
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-xs text-stone-500 dark:text-stone-400 py-4 text-center">No reviews yet. Be the first to review this work!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev._id} className="p-4 bg-stone-50/70 dark:bg-white/5 rounded-xl border border-stone-100 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-[#C6A15B]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C6A15B]" />
                    ))}
                  </div>
                  {rev.isVerifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-stone-400 font-sans">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>

              {rev.title && <h5 className="font-bold text-xs text-[#202522] dark:text-white">{rev.title}</h5>}
              <p className="text-xs text-stone-600 dark:text-stone-300 italic font-serif leading-relaxed">"{rev.comment}"</p>
              <p className="text-[11px] font-sans font-medium text-stone-500 dark:text-stone-400">
                — {typeof rev.user === 'object' ? rev.user.name : 'Reader'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
