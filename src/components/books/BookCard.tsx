import React from 'react';
import { Link } from 'react-router-dom';
import { Star, BookOpen, Clock, ArrowUpRight } from 'lucide-react';
import { Book } from '../../types';
import { Badge } from '../common/Badge';

interface BookCardProps {
  book: Book;
  variant?: 'standard' | 'compact' | 'featured';
  onQuickBuy?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, variant = 'standard', onQuickBuy }) => {
  return (
    <Link
      to={`/books/${book._id}`}
      className="catalog-card group flex flex-col bg-white dark:bg-[#071A17] rounded-xl border border-[#DDE8E1] dark:border-white/10 hover:border-[#077432]/50 dark:hover:border-[#34D399]/50 p-4 transition-all duration-300 hover:shadow-lg dark:hover:shadow-black/40 hover:-translate-y-1"
    >
      {/* Book Cover Container */}
      <div className="relative h-56 sm:h-64 w-full rounded-lg overflow-hidden bg-stone-100 dark:bg-white/5 mb-5 transition-shadow">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-contain object-center p-5 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {book.isFeatured && (
          <div className="absolute top-2.5 left-2.5 z-10">
           
          </div>
        )}

        {book.isNewRelease && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <Badge variant="emerald">New</Badge>
          </div>
        )}
      </div>

      {/* Book Metadata */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
            <span className="font-sans font-medium text-[#077432] dark:text-[#34D399] uppercase tracking-wider text-[10px]">
              {typeof book.category === 'object' ? book.category.name : 'Wisdom'}
            </span>
            <div className="flex items-center gap-1 font-sans">
              <Star className="w-3 h-3 text-[#C6A15B] fill-[#C6A15B]" />
              <span className="font-semibold text-stone-700 dark:text-stone-300">{book.rating.toFixed(1)}</span>
            </div>
          </div>

          <h3 className="font-serif font-semibold text-lg text-[#202522] dark:text-white group-hover:text-[#077432] dark:group-hover:text-[#34D399] transition-colors line-clamp-2 leading-snug">
            {book.title}
          </h3>

          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-1 font-sans">
            by {book.author}
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono font-bold text-base text-[#077432] dark:text-[#34D399]">
              ${book.price.toFixed(2)}
            </span>
            {book.originalPrice && book.originalPrice > book.price && (
              <span className="font-mono text-xs text-stone-400 line-through">
                ${book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <span className="text-xs font-sans text-[#077432] dark:text-[#34D399] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            Preview
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};
