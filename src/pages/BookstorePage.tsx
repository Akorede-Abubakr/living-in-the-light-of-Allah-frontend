import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { booksApi, categoriesApi } from '../api';
import { BookGrid } from '../components/books/BookGrid';
import { CategoryFilter } from '../components/books/CategoryFilter';
import { SearchBar } from '../components/books/SearchBar';
import { PriceFilter } from '../components/books/PriceFilter';
import { SortDropdown } from '../components/books/SortDropdown';
import { SEO } from '../components/common/SEO';

export const BookstorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';

  const [search, setSearch] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sort, setSort] = useState(sortParam);
  const [page, setPage] = useState(1);

  // Fetch Categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories(),
  });
  const categories = categoriesData?.data.data || [];

  // Fetch Books
  const { data: booksData, isLoading, isError, refetch } = useQuery({
    queryKey: ['books', selectedCategory, search, sort, priceRange, page],
    queryFn: () =>
      booksApi.getBooks({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        q: search || undefined,
        sortBy: sort,
        maxPrice: priceRange[1] < 100 ? priceRange[1] : undefined,
        page,
        limit: 12,
      }),
  });

  const books = booksData?.data.data || [];
  const pagination = booksData?.data.pagination || { page: 1, totalPages: 1, total: 0 };
  const totalPages = Math.max(1, pagination.totalPages);
  useEffect(() => {
    if (booksData && page > totalPages) setPage(totalPages);
  }, [booksData, page, totalPages]);
  const firstPage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => firstPage + i);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setPage(1);
    setSearchParams((prev) => {
      if (slug === 'all') prev.delete('category');
      else prev.set('category', slug);
      return prev;
    });
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className="bookstore-page w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      <SEO
        title="Bookstore Catalog — Living in the light of Allah"
        description="Browse our curated collection of illuminated Islamic literature, philosophy, and spiritual works."
      />

      {/* Header Banner */}
      <div className="catalog-heading space-y-3">
        <span className="text-xs font-sans uppercase font-bold text-[#077432] dark:text-[#34D399] tracking-widest">
          The collection
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#202522] dark:text-white">
          Your next chapter starts here.
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300">
          Discover classical and contemporary illuminated volumes designed for seekers of knowledge.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#071A17] p-4 sm:p-6 rounded-2xl border border-[#DDE8E1] dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:max-w-md">
            <SearchBar value={search} onChange={handleSearchChange} />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="w-36 hidden sm:block">
              <PriceFilter priceRange={priceRange} onChange={range => { setPriceRange(range); setPage(1); }} />
            </div>
            <SortDropdown value={sort} onChange={value => { setSort(value); setPage(1); }} />
          </div>
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />
      </div>

      {/* Book Grid */}
      {isError ? (
        <div role="alert" className="rounded-xl border p-6 text-center">
          <p>Could not load the bookstore.</p>
          <button onClick={() => void refetch()} className="mt-3 underline">Retry</button>
        </div>
      ) : <BookGrid books={books} isLoading={isLoading} />}

      {/* Pagination */}
      {booksData && !isError && (
        <nav aria-label="Bookstore pages" className="flex flex-wrap justify-center items-center gap-2 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            className="px-4 py-2 bg-white dark:bg-[#071A17] border border-[#DDE8E1] dark:border-white/10 rounded-lg text-xs font-semibold text-stone-700 dark:text-stone-200 disabled:opacity-40 hover:bg-stone-50 dark:hover:bg-white/5 transition-colors"
          >
            Previous
          </button>
          {pageNumbers.map(number => (
            <button key={number} type="button" aria-label={`Page ${number}`} aria-current={number === page ? 'page' : undefined}
              onClick={() => setPage(number)} disabled={isLoading}
              className={`rounded-lg border px-3 py-2 text-xs ${number === page ? 'bg-[#123C35] text-white' : 'bg-white text-[#123C35] dark:bg-[#071A17] dark:text-white'}`}>
              {number}
            </button>
          ))}
          <span aria-live="polite" className="text-xs font-sans text-stone-500 dark:text-stone-400">
            {pagination.total} books · Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isLoading}
            className="px-4 py-2 bg-white dark:bg-[#071A17] border border-[#DDE8E1] dark:border-white/10 rounded-lg text-xs font-semibold text-stone-700 dark:text-stone-200 disabled:opacity-40 hover:bg-stone-50 dark:hover:bg-white/5 transition-colors"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
};
