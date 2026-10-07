import React from 'react';
import { Book } from '../../types';
import { BookCard } from './BookCard';
import { BookGridSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

interface BookGridProps {
  books: Book[];
  isLoading?: boolean;
  onQuickBuy?: (book: Book) => void;
  columns?: 3 | 4;
}

export const BookGrid: React.FC<BookGridProps> = ({
  books,
  isLoading = false,
  onQuickBuy,
  columns = 4,
}) => {
  if (isLoading) {
    return <BookGridSkeleton count={8} />;
  }

  if (!books || books.length === 0) {
    return <EmptyState type="search" />;
  }

  const gridColsClass =
    columns === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={`grid ${gridColsClass} gap-6 sm:gap-8`}>
      {books.map((book) => (
        <BookCard key={book._id} book={book} onQuickBuy={onQuickBuy} />
      ))}
    </div>
  );
};
