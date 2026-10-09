import React from 'react';

export const BookCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-white dark:bg-[#071A17] rounded-[20px] border border-stone-200/70 dark:border-white/10 p-3 animate-pulse">
      <div className="h-56 sm:h-64 bg-stone-200 dark:bg-white/10 rounded-xl mb-5 w-full" />
      <div className="h-4 bg-stone-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-stone-200 rounded w-1/2 mb-3" />
      <div className="h-3 bg-stone-200 rounded w-full mb-4" />
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-stone-100">
        <div className="h-5 bg-stone-200 rounded w-16" />
        <div className="h-8 bg-stone-200 rounded w-24" />
      </div>
    </div>
  );
};

export const BookGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const BookDetailsSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-64 sm:w-80 aspect-[2/3] bg-stone-200 rounded-lg shadow-lg" />
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="h-5 bg-stone-200 rounded w-28" />
          <div className="h-10 bg-stone-200 rounded w-3/4" />
          <div className="h-5 bg-stone-200 rounded w-1/2" />
          <div className="h-4 bg-stone-200 rounded w-1/4" />
          <div className="space-y-2 pt-4">
            <div className="h-4 bg-stone-200 rounded w-full" />
            <div className="h-4 bg-stone-200 rounded w-full" />
            <div className="h-4 bg-stone-200 rounded w-4/5" />
          </div>
          <div className="flex gap-4 pt-6">
            <div className="h-12 bg-stone-200 rounded w-36" />
            <div className="h-12 bg-stone-200 rounded w-48" />
          </div>
        </div>
      </div>
    </div>
  );
};
