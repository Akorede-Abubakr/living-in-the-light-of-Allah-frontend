import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { blogsApi } from '../api';
import { BlogPost } from '../types';
import {
  Search,
  BookOpen,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Calendar,
  Share2,
  Tag,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const BlogListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blogs', { page: currentPage, category: selectedCategory, search: searchQuery }],
    queryFn: async () => {
      const params: Record<string, any> = { page: currentPage, limit: 9 };
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      const res = await blogsApi.getBlogs(params);
      return res.data;
    },
  });

  const blogs = data?.data || [];
  const categories = ['All', ...(data?.categories || [
    'Faith & Spirituality',
    'Quranic Reflections',
    'Daily Living & Adab',
    'History & Civilization',
    'Islamic Ethics',
  ])];
  const pagination = data?.pagination;

  // Use the first blog in list as featured if on page 1 and no specific search
  const featuredBlog = currentPage === 1 && !searchQuery && selectedCategory === 'All' ? blogs[0] : null;
  const standardBlogs = featuredBlog ? blogs.slice(1) : blogs;

  return (
    <div className="min-h-screen bg-[#FDFCF7] dark:bg-[#071A17] text-[#202522] dark:text-[#F8F5ED] transition-colors pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#077432]/10 via-[#077432]/5 to-transparent pt-12 pb-16 border-b border-[#077432]/10 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6">
            <Link to="/" className="hover:text-[#077432] dark:hover:text-[#C6A15B] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#077432] dark:text-[#C6A15B] font-medium">My blog</span>
          </div>

          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
              Reflections, Knowledge & Spiritual Growth
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-[#DDE8E1] leading-relaxed">
              Explore insightful writings on prophetic wisdom, Quranic contemplation, and practical daily Islamic ethics crafted to enrich your daily walk with the Divine.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search reflections, topics, or authors..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#0B2520] border border-[#077432]/20 dark:border-white/10 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#077432] dark:focus:ring-[#C6A15B] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#077432] text-white shadow-md shadow-[#077432]/25'
                    : 'bg-white dark:bg-[#0B2520] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-[#077432]/40 hover:text-[#077432] dark:hover:text-[#C6A15B]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-[#077432] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading inspiring articles...</p>
          </div>
        ) : isError ? (
          <div className="py-20 text-center">
            <p className="text-red-500 font-medium">Unable to load blog articles right now.</p>
            <p className="text-xs text-gray-500 mt-1">Please try refreshing the page.</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
              No Articles Found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              We couldn&apos;t find any articles matching your search criteria. Try selecting another category or clearing your search.
            </p>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-5 px-5 py-2.5 rounded-xl bg-[#077432] text-white text-xs font-semibold hover:bg-[#065F29] transition-all"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Post (if available) */}
            {featuredBlog && (
              <div className="group relative bg-white dark:bg-[#0B2520] rounded-3xl border border-[#077432]/15 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={
                        featuredBlog.coverImage ||
                        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'
                      }
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fetchPriority="high"
                      decoding="async"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-[#077432] text-white text-[11px] font-bold uppercase tracking-wider shadow">
                        Featured Read
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-xs font-semibold text-[#077432] dark:text-[#C6A15B]">
                        <span>{featuredBlog.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-normal text-gray-500 dark:text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          {featuredBlog.readTimeMinutes || 5} min read
                        </span>
                      </div>

                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-snug group-hover:text-[#077432] dark:group-hover:text-[#C6A15B] transition-colors">
                        <Link to={`/blog/${featuredBlog.slug}`}>
                          {featuredBlog.title}
                        </Link>
                      </h2>

                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                        {featuredBlog.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#077432]/10 dark:bg-[#C6A15B]/20 text-[#077432] dark:text-[#C6A15B] flex items-center justify-center font-bold text-xs">
                          {featuredBlog.author ? featuredBlog.author[0] : 'L'}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900 dark:text-white">
                            {featuredBlog.author || 'Living in the Light'}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            {new Date(featuredBlog.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`/blog/${featuredBlog.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#077432] dark:text-[#C6A15B] hover:gap-2.5 transition-all"
                      >
                        Read Article
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grid of Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {standardBlogs.map((blog) => (
                <article
                  key={blog._id}
                  className="group bg-white dark:bg-[#0B2520] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800 relative block"
                  >
                    <img
                      src={
                        blog.coverImage ||
                        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'
                      }
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider">
                      {blog.category}
                    </span>
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#077432] dark:text-[#C6A15B]" />
                          {new Date(blog.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {blog.readTimeMinutes || 5} min read
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#077432] dark:group-hover:text-[#C6A15B] transition-colors">
                        <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                      </h3>

                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                        <span className="font-medium truncate max-w-[130px]">
                          {blog.author || 'Living in the Light'}
                        </span>
                      </div>

                      <Link
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#077432] dark:text-[#C6A15B] group-hover:translate-x-0.5 transition-transform"
                      >
                        Read
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-500 px-3">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  disabled={currentPage >= pagination.totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Bookstore Cross-Promotion Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-gradient-to-r from-[#077432] via-[#0A8D3E] to-[#123C35] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#C6A15B]">
              Authentic Islamic Knowledge
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
              Looking to Dive Deeper into Classical Texts?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Explore our curated library of published Islamic books, digital readers, tafsir commentaries, and spiritual guides in our bookstore.
            </p>
            <div className="pt-2">
              <Link
                to="/books"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#077432] font-semibold text-xs shadow-lg hover:bg-[#F8F5ED] hover:shadow-xl transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Browse Bookstore
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default BlogListPage;
