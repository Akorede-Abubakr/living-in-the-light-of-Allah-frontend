import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { booksApi, readerApi, reviewsApi, libraryApi } from '../api';
import { BookHero } from '../components/details/BookHero';
import { TableOfContents } from '../components/details/TableOfContents';
import { ReviewsSection } from '../components/details/ReviewsSection';
import { PurchaseModal } from '../components/details/PurchaseModal';
import { SEO } from '../components/common/SEO';
import { useAuth } from '../context/AuthContext';

export const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  // 1. Fetch Book Details
  const { data: bookData, isLoading, refetch: refetchBook } = useQuery({
    queryKey: ['book', id],
    queryFn: () => booksApi.getBookById(id!),
    enabled: !!id,
  });

  // 2. Fetch Reader Metadata & Chapters
  const { data: metaData } = useQuery({
    queryKey: ['bookMeta', id],
    queryFn: () => readerApi.getMeta(id!),
    enabled: !!id,
  });

  // 3. Fetch Reviews
  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ['bookReviews', id],
    queryFn: () => reviewsApi.getBookReviews(id!),
    enabled: !!id,
  });

  // 4. Check Access / Reader Info
  const { data: accessData, refetch: refetchAccess } = useQuery({
    queryKey: ['readerAccess', id],
    queryFn: () => libraryApi.checkOwnership(id!),
    enabled: !!id && isAuthenticated,
  });

  const book = bookData?.data.data;
  const chapters = metaData?.data.data?.chapters || (book as any)?.chapters || [];
  const reviews = reviewsData?.data.data?.reviews || [];
  const hasPurchased = accessData?.data?.isPurchased || false;

  if (isLoading || !book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-8 h-8 border-4 border-[#123C35] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500 font-sans">Loading illuminated volume...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      <SEO
        title={`${book.title} by ${book.author} — Living in the light of Allah`}
        description={book.description}
      />

      {/* Back Link */}
      <div>
        <Link
          to="/books"
          className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-stone-600 hover:text-[#123C35] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bookstore</span>
        </Link>
      </div>

      {/* Main Hero Component */}
      <BookHero
        book={book}
        onOpenPurchase={() => setIsPurchaseModalOpen(true)}
        hasPurchased={hasPurchased}
      />

      {/* Table of Contents & Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-8">
          <TableOfContents
            bookId={book._id}
            chapters={chapters}
            previewLimit={book.previewPages || 5}
          />
        </div>

        <div className="lg:col-span-5 space-y-8">
          <ReviewsSection
            bookId={book._id}
            reviews={reviews}
            onReviewAdded={() => {
              refetchReviews();
              refetchBook();
            }}
          />
        </div>
      </div>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        book={book}
        onPurchaseSuccess={() => {
          refetchAccess();
          refetchBook();
        }}
      />
    </div>
  );
};
