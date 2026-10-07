import React from 'react';
import { Link } from 'react-router-dom';
import { Star, BookOpen, Layers, Globe, Shield, ShoppingBag, Eye, ArrowRight } from 'lucide-react';
import { Book } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface BookHeroProps {
  book: Book;
  onOpenPurchase: () => void;
  hasPurchased?: boolean;
}

export const BookHero: React.FC<BookHeroProps> = ({
  book,
  onOpenPurchase,
  hasPurchased = false,
}) => {
  return (
    <div className="bg-white dark:bg-[#071A17] rounded-2xl border border-[#DDE8E1] dark:border-white/10 p-6 sm:p-10 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Book Cover Column */}
        <div className="md:col-span-4 flex flex-col items-center">
          <div className="relative aspect-[3/4] w-full max-w-[280px] rounded-xl overflow-hidden shadow-book-lg book-spine-shadow bg-stone-100 dark:bg-white/5">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            {book.isFeatured && (
              <div className="absolute top-3 left-3 z-10">
                <Badge variant="gold">Featured Work</Badge>
              </div>
            )}
          </div>

          <div className="mt-6 w-full max-w-[280px] space-y-3">
            {hasPurchased ? (
              <Link to={`/read/${book._id}?page=1`} className="block w-full">
                <Button variant="editorial" size="lg" className="w-full py-3.5 shadow-md">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read Full Book
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  variant="editorial"
                  size="lg"
                  className="w-full py-3.5 shadow-md"
                  onClick={onOpenPurchase}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Buy Volume (${book.price.toFixed(2)})
                </Button>

                <Link to={`/read/${book._id}?page=1`} className="block w-full">
                  <Button variant="outline" size="md" className="w-full py-2.5">
                    <Eye className="w-4 h-4 mr-2" />
                    Read Free Preview ({book.previewPages || 5} Pages)
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Book Details Column */}
        <div className="md:col-span-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-sans uppercase font-bold text-[#077432] dark:text-[#34D399] tracking-widest">
                {typeof book.category === 'object' ? book.category.name : 'Category'}
              </span>
              <span className="text-stone-300 dark:text-stone-600">•</span>
              <div className="flex items-center gap-1 text-xs">
                <Star className="w-3.5 h-3.5 text-[#C6A15B] fill-[#C6A15B]" />
                <span className="font-bold text-stone-800 dark:text-stone-200">{book.rating.toFixed(1)}</span>
                <span className="text-stone-500 dark:text-stone-400">({book.reviewCount} reader reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#202522] dark:text-white tracking-tight leading-tight">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="font-serif italic text-lg text-stone-600 dark:text-stone-300">
                {book.subtitle}
              </p>
            )}

            <p className="text-sm text-stone-600 dark:text-stone-300 font-sans">
              Authored by <strong className="text-[#077432] dark:text-[#34D399]">{book.author}</strong>
            </p>
          </div>

          {/* Description */}
          <div className="prose prose-stone text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans max-w-none">
            <p>{book.description}</p>
          </div>

          {/* Specs Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-100 dark:border-white/10 font-sans text-xs">
            <div className="p-3 bg-stone-50 dark:bg-white/5 rounded-xl border border-[#DDE8E1] dark:border-white/10">
              <span className="text-stone-500 dark:text-stone-400 text-[11px] block">Total Pages</span>
              <span className="font-bold text-[#077432] dark:text-[#34D399] text-sm">{book.pageCount || 15} Pages</span>
            </div>
            <div className="p-3 bg-stone-50 dark:bg-white/5 rounded-xl border border-[#DDE8E1] dark:border-white/10">
              <span className="text-stone-500 dark:text-stone-400 text-[11px] block">Language</span>
              <span className="font-bold text-[#077432] dark:text-[#34D399] text-sm">{book.language || 'English'}</span>
            </div>
            <div className="p-3 bg-stone-50 dark:bg-white/5 rounded-xl border border-[#DDE8E1] dark:border-white/10">
              <span className="text-stone-500 dark:text-stone-400 text-[11px] block">Free Preview</span>
              <span className="font-bold text-[#077432] dark:text-[#34D399] text-sm">{book.previewPages || 5} Pages</span>
            </div>
            <div className="p-3 bg-stone-50 dark:bg-white/5 rounded-xl border border-[#DDE8E1] dark:border-white/10">
              <span className="text-stone-500 dark:text-stone-400 text-[11px] block">Format</span>
              <span className="font-bold text-[#077432] dark:text-[#34D399] text-sm">Interactive Reader</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
