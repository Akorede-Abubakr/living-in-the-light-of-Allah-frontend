import React from 'react';
import { BookOpen, SearchX, BookmarkX, ShoppingBag } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  type?: 'search' | 'books' | 'bookmarks' | 'orders' | 'general';
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'general',
  title,
  description,
  actionText,
  actionHref,
  onAction,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'search':
        return <SearchX className="w-10 h-10 text-stone-400" />;
      case 'bookmarks':
        return <BookmarkX className="w-10 h-10 text-stone-400" />;
      case 'orders':
        return <ShoppingBag className="w-10 h-10 text-stone-400" />;
      default:
        return <BookOpen className="w-10 h-10 text-stone-400" />;
    }
  };

  const defaultTitles = {
    search: 'No books match your criteria',
    books: 'No books available yet',
    bookmarks: 'No saved bookmarks yet',
    orders: 'No purchase history',
    general: 'Nothing found here',
  };

  const defaultDescriptions = {
    search: 'Try adjusting your search filters, checking spelling, or browsing our curated collections.',
    books: 'Explore our catalog or check back soon as new literary works are added frequently.',
    bookmarks: 'While reading any book in our digital reader, tap the bookmark icon to save noteworthy passages.',
    orders: 'When you purchase books, your order receipts and lifetime access records will appear here.',
    general: 'There is currently no data to display in this view.',
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white/60 rounded-xl border border-dashed border-stone-300/80 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
        {getIcon()}
      </div>
      <h4 className="text-lg font-serif font-bold text-ink-900 mb-2">
        {title || defaultTitles[type]}
      </h4>
      <p className="text-sm text-ink-500 max-w-sm mb-6 leading-relaxed">
        {description || defaultDescriptions[type]}
      </p>

      {actionText && actionHref && (
        <Link to={actionHref}>
          <Button variant="secondary" size="md">
            {actionText}
          </Button>
        </Link>
      )}

      {actionText && onAction && !actionHref && (
        <Button variant="secondary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
