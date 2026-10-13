import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Sparkles, ArrowRight, CheckCircle2, Check, Compass, Layers, Bookmark, Newspaper, Clock } from 'lucide-react';
import { booksApi, categoriesApi, blogsApi } from '../api';
import { BookGrid } from '../components/books/BookGrid';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { SEO } from '../components/common/SEO';

export const HomePage: React.FC = () => {
  const { data: featuredData, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['featuredBooks'],
    queryFn: () => booksApi.getFeatured(),
  });

  const { data: popularData, isLoading: isPopularLoading } = useQuery({
    queryKey: ['popularBooks'],
    queryFn: () => booksApi.getPopular(),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories(),
  });

  const { data: blogsData } = useQuery({
    queryKey: ['homeLatestBlogs'],
    queryFn: () => blogsApi.getBlogs({ limit: 3 }),
  });

  const featuredBooks = featuredData?.data.data || [];
  const popularBooks = popularData?.data.data || [];
  const categories = categoriesData?.data.data || [];
  const latestBlogs = blogsData?.data.data || [];
  const heroSpotlight = featuredBooks[0] || popularBooks[0];

  return (
    <div className="home-page flex-1 flex flex-col">
      <SEO
        title="Living in the light of Allah — Discover Books Worth Reading"
        description="A curated digital bookstore and illuminated reading platform for seekers of timeless wisdom, knowledge, and spiritual growth."
      />

      {/* Hero Section */}
      <section className="editorial-hero relative overflow-hidden bg-gradient-to-b from-stone-50/80 via-white to-white dark:from-[#09221D] dark:via-[#071A17] dark:to-[#071A17] pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[#DDE8E1] dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            {/* "Living in the light of Allah" div */}
            <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
              <div className="eyebrow"><span /> A little reading. A deeper connection.</div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#202522] dark:text-white leading-[1.1] tracking-tight">
                Living in the <br />
                <span className="italic font-normal text-[#077432] dark:text-[#34D399]">light of Allah.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                Timeless wisdom for a thoughtful life. Discover Islamic literature, explore a chapter, and make space for the knowledge that stays with you.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/register">
                  <Button variant="editorial" size="lg" className="w-full sm:w-auto px-8 py-3.5 text-base shadow-md hover:shadow-lg">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                {(
                  <Link to={`/books`}>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 py-3.5 text-base bg-white/90 dark:bg-white/10">
                      <BookOpen className="w-4 h-4 mr-2 text-[#077432]" />
                      <span>Explore Bookstore</span>
                    </Button>
                  </Link>
                )}
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 lg:gap-6 text-[10px] sm:text-xs text-stone-600 dark:text-stone-300 font-mono overflow-x-auto whitespace-nowrap">
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#077432] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                  </span>
                  <span>Free Chapter Previews</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#077432] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                  </span>
                  <span>Lifetime Cloud Sync</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#077432] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                  </span>
                  <span>Distraction-Free Reader</span>
                </div>
              </div>
            </div>

            {/* Right Image Div (hidden on mobile, displayed on desktop) */}
            <div className="hero-art flex w-full lg:w-1/2 justify-center lg:justify-end">
              <div className="hero-frame w-full max-w-lg overflow-hidden bg-white dark:bg-[#0A2621] transition-all duration-300 group">
                <img
                  src="/images/editors-choice.png"
                  alt="Living in the light of Allah"
                  className="w-full h-auto object-cover block group-hover:scale-102 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thoughtfully selected Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#DDE8E1] dark:border-white/10">
          <div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522] dark:text-white mt-1">
              Thoughtfully selected
            </h2>
          </div>
          <Link
            to="/books"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#077432] dark:text-[#34D399] hover:text-[#0A8D3E] dark:hover:text-[#6EE7B7] group"
          >
            <span>Browse all featured</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <BookGrid books={featuredBooks.slice(0, 4)} isLoading={isFeaturedLoading} />
      </section>

      {/* Dynamic Database Categories Section */}
      <section className="py-16 bg-stone-50/70 dark:bg-[#051512] border-y border-[#DDE8E1] dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522] dark:text-white">
              Follow your curiosity
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              Find your next read across the many paths of Islamic knowledge.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/books?category=${cat.slug}`}
                className="group p-5 bg-white dark:bg-[#071A17] rounded-xl border border-[#DDE8E1] dark:border-white/10 hover:border-[#077432]/50 dark:hover:border-[#34D399]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-base text-[#202522] dark:text-white group-hover:text-[#077432] dark:group-hover:text-[#34D399] transition-colors">
                    {cat.name}
                  </h4>
                  {cat.description && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed font-sans">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-white/10 flex items-center justify-between text-xs font-mono text-stone-500 dark:text-stone-400 group-hover:text-[#077432] dark:group-hover:text-[#34D399]">
                  <span>{cat.bookCount || 0} Books</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#DDE8E1] dark:border-white/10">
          <div>
            
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522] dark:text-white mt-1">
              Reader favorites
            </h2>
          </div>
          <Link
            to="/books?sort=popular"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#077432] dark:text-[#34D399] hover:text-[#0A8D3E] dark:hover:text-[#6EE7B7] group"
          >
            <span>View top bestsellers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <BookGrid books={popularBooks.slice(0, 4)} isLoading={isPopularLoading} />
      </section>

      {/* The Reading Experience Section */}
      <section className="py-16 sm:py-24 bg-[#077432] text-[#F8F5ED] border-y border-[#0A8D3E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-6 flex flex-col justify-center">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
                Make room for <br />
                <span className="italic text-[#C6A15B]">deeper reading.</span>
              </h2>
              <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-sans">
                Reading sacred manuscripts requires more than scrolling an endless webpage. Our digital reader breaks volumes into structured chapters and discrete pages, offering paper, sepia, and night modes with instant progress memory.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-md bg-[#0A8D3E] text-[#C6A15B] flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-white">
                      Generous Sample Previews
                    </h4>
                    <p className="text-xs text-stone-300 mt-0.5">
                      Sample early chapters for free on any device before making an acquisition decision.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-md bg-[#0A8D3E] text-[#C6A15B] flex items-center justify-center shrink-0 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-white">
                      Custom Reading Themes & Fonts
                    </h4>
                    <p className="text-xs text-stone-300 mt-0.5">
                      Switch effortlessly between Day Paper, Warm Sepia, and Obsidian Dark modes with adjustable font sizes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-md bg-[#0A8D3E] text-[#C6A15B] flex items-center justify-center shrink-0 mt-0.5">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-white">
                      Bookmarks & Automatic Progress Sync
                    </h4>
                    <p className="text-xs text-stone-300 mt-0.5">
                      Never lose your place. Return to any manuscript and resume seamlessly from your last read page.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Representation of Reader */}
            <div className="lg:col-span-6 flex items-stretch justify-center">
              <div className="w-full max-w-lg bg-white dark:bg-[#051814] text-[#202522] dark:text-[#F8F5ED] rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#0A8D3E]/40 dark:border-white/10 flex flex-col justify-between space-y-5">
                {/* Reader Chrome / Navigation Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-stone-200/80 dark:border-white/10">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#077432]/10 dark:bg-[#C6A15B]/15 text-[#077432] dark:text-[#C6A15B] flex items-center justify-center shrink-0">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-[#202522] dark:text-white truncate">
                        Your digital reading space
                      </h4>
                      <p className="text-[10px] text-[#077432] dark:text-[#C6A15B] font-mono">
                        Chapter II: The Inner Citadel
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-white/5 font-mono text-[11px] text-stone-600 dark:text-stone-300">
                      Page 3 of 18
                    </span>
                    <span className="w-6 h-6 rounded-md bg-[#077432] text-white flex items-center justify-center shadow-xs">
                      <Bookmark className="w-3 h-3 fill-current" />
                    </span>
                  </div>
                </div>

                {/* Expanded Manuscript Prose */}
                <div className="space-y-3.5 py-1 font-serif flex-1 flex flex-col justify-center">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500 font-semibold">
                      Section 2.1 — On Solitude & Knowledge
                    </span>
                    <h3 className="font-bold text-lg sm:text-xl text-[#077432] dark:text-[#34D399] leading-snug">
                      The Cost of Perpetual Availability
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-200">
                    "When you declare yourself reachable by everyone at every moment, you surrender the possibility of ever reaching depth within yourself. The heart, like sacred soil, requires deliberate stillness to yield insights that outlive the hour."
                  </p>

                  <div className="border-l-3 border-[#077432] dark:border-[#C6A15B] pl-4 py-2 bg-[#077432]/5 dark:bg-[#C6A15B]/10 rounded-r-xl my-1">
                    <p className="italic text-xs sm:text-sm text-[#077432] dark:text-[#C6A15B] leading-relaxed">
                      "Knowledge acquired without contemplative pause is like rain upon solid rock; it wets the outer shell but nurtures no enduring root."
                    </p>
                    <span className="block text-[10px] font-mono text-stone-500 dark:text-stone-400 mt-1 not-italic">
                      — Classical Adab Treatise, Folio 14b
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                    True devotion is not the absence of worldly affairs, but the conscious art of reserving sanctuaries of time where the soul communes undisturbed with Divine revelation.
                  </p>
                </div>

                {/* Reader Controls & Progress Footer */}
                <div className="pt-3.5 border-t border-stone-200/80 dark:border-white/10 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-stone-500 dark:text-stone-400">Reading Progress</span>
                      <span className="text-[#077432] dark:text-[#34D399] font-bold">38% Completed</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#077432] dark:bg-[#34D399] rounded-full transition-all duration-500" style={{ width: '38%' }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500 font-mono text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-white/10 text-[#077432] dark:text-[#34D399] font-bold">Paper</span>
                      <span className="px-2 py-0.5 rounded hover:bg-stone-100 dark:hover:bg-white/5 cursor-default">Sepia</span>
                      <span className="px-2 py-0.5 rounded hover:bg-stone-100 dark:hover:bg-white/5 cursor-default">Night</span>
                    </div>

                    <Link
                      to="/books"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#077432] dark:text-[#34D399] hover:underline"
                    >
                      <span>Open Full Reader</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* From My Blog: Latest Reflections */}
      {latestBlogs.length > 0 && (
        <section className="py-16 sm:py-24 bg-white dark:bg-[#071A17] border-b border-[#DDE8E1] dark:border-white/10 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#202522] dark:text-white">
                  From My Blog: Latest Reflections
                </h2>
                <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 mt-2 max-w-xl">
                  Thoughtful writings on spiritual cultivation, noble character, and timeless Islamic wisdom.
                </p>
              </div>

              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#077432] dark:text-[#C6A15B] hover:gap-2.5 transition-all self-start md:self-auto"
              >
                <span>Explore All Articles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestBlogs.map((blog) => (
                <article
                  key={blog._id}
                  className="group bg-[#FDFCF7] dark:bg-[#0B2520] rounded-2xl border border-stone-200/80 dark:border-white/10 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800 relative block"
                  >
                    <img
                      src={
                        blog.coverImage ||
                        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider">
                      {blog.category}
                    </span>
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#077432] dark:text-[#C6A15B]" />
                          {blog.readTimeMinutes || 5} min read
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(blog.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-[#202522] dark:text-white line-clamp-2 leading-snug group-hover:text-[#077432] dark:group-hover:text-[#C6A15B] transition-colors">
                        <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                      </h3>

                      <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-200/60 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs font-medium text-stone-700 dark:text-stone-300 truncate max-w-[140px]">
                        {blog.author || 'Living in the Light'}
                      </span>
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="text-xs font-semibold text-[#077432] dark:text-[#C6A15B] group-hover:underline"
                      >
                        Read →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Banner */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-stone-50 dark:from-[#071A17] dark:to-[#051512] border-b border-[#DDE8E1] dark:border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#202522] dark:text-white">
            Expand Your Sacred Knowledge Today
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl mx-auto leading-relaxed font-sans">
            Join a global community of thoughtful seekers exploring literature that nourishes the intellect and anchors the soul.
          </p>
          <div className="pt-2">
            <Link to="/books">
              <Button variant="editorial" size="lg" className="px-8 py-3.5 text-base shadow-md">
                Browse Full Catalog
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
