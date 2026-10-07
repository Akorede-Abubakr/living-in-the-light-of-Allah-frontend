import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { blogsApi } from '../api';
import { BlogPost } from '../types';
import { useToast } from '../context/ToastContext';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  Eye,
  Share2,
  Check,
  BookOpen,
  User,
  ArrowRight,
  Tag,
  Bookmark,
  Sparkles,
} from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { success: showSuccessToast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Missing slug');
      const res = await blogsApi.getBlogBySlug(slug);
      return res.data;
    },
    enabled: !!slug,
  });

  const blog = data?.data?.blog;
  const relatedBlogs = data?.data?.related || [];

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      showSuccessToast('Article link copied to clipboard!');
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      showSuccessToast('Article link ready to share!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCF7] dark:bg-[#071A17] flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#077432] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Loading sacred reflections...</p>
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-[70vh] bg-[#FDFCF7] dark:bg-[#071A17] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
            Article Not Found
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-6">
            The article you are looking for may have been moved or unpublished.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#077432] text-white text-xs font-semibold hover:bg-[#065F29] transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to My blog
          </Link>
        </div>
      </div>
    );
  }

  // Format paragraphs from markdown / content string
  const paragraphs = blog.content.split('\n\n').filter((p) => p.trim());

  return (
    <article className="min-h-screen bg-[#FDFCF7] dark:bg-[#071A17] text-[#202522] dark:text-[#F8F5ED] transition-colors pb-24">
      {/* Article Header & Navigation */}
      <div className="bg-gradient-to-b from-[#077432]/10 via-[#077432]/5 to-transparent pt-8 pb-12 border-b border-[#077432]/10 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-[#077432] dark:hover:text-[#C6A15B] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to My blog
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#0B2520] border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-700 dark:text-gray-200 hover:border-[#077432] transition-colors shadow-xs"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-gray-500" />
                  <span>Share Article</span>
                </>
              )}
            </button>
          </div>

          {/* Category & Metadata */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#077432]/10 dark:bg-[#C6A15B]/15 text-[#077432] dark:text-[#C6A15B] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {blog.category}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
              {blog.title}
            </h1>

            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-serif italic">
              {blog.excerpt}
            </p>

            {/* Author bar */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200/60 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#077432] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {blog.author ? blog.author[0] : 'L'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {blog.author || 'Living in the Light Editorial'}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Published on{' '}
                    {new Date(blog.createdAt).toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#077432] dark:text-[#C6A15B]" />
                  {blog.readTimeMinutes || 5} min read
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  {blog.views || 0} reads
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Cover Image */}
      {blog.coverImage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-12">
          <div className="aspect-[21/9] sm:aspect-[2/1] rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-gray-800">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-gray-800 dark:text-[#E2EBE5] leading-relaxed text-base sm:text-lg">
          {paragraphs.map((p, idx) => {
            // Check if paragraph is markdown header
            if (p.startsWith('## ')) {
              return (
                <h2
                  key={idx}
                  className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-10 pt-6 border-t border-gray-100 dark:border-white/10"
                >
                  {p.replace('## ', '')}
                </h2>
              );
            }
            if (p.startsWith('### ')) {
              return (
                <h3
                  key={idx}
                  className="font-serif text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8"
                >
                  {p.replace('### ', '')}
                </h3>
              );
            }
            if (p.startsWith('> ')) {
              return (
                <blockquote
                  key={idx}
                  className="border-l-4 border-[#077432] dark:border-[#C6A15B] pl-5 py-2 my-6 italic bg-[#077432]/5 dark:bg-[#C6A15B]/5 rounded-r-xl font-serif text-gray-800 dark:text-emerald-100"
                >
                  {p.replace(/^>\s*/gm, '')}
                </blockquote>
              );
            }
            if (p.startsWith('- ') || p.startsWith('* ')) {
              const items = p.split('\n').filter((item) => item.trim());
              return (
                <ul key={idx} className="list-disc pl-6 space-y-2 text-base">
                  {items.map((item, itemIdx) => (
                    <li key={itemIdx}>{item.replace(/^[-*]\s*/, '')}</li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={idx} className="leading-relaxed">
                {p}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="pt-10 mt-12 border-t border-gray-200 dark:border-white/10">
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Topics & Themes
            </h4>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-gray-100 dark:bg-[#0B2520] text-gray-700 dark:text-gray-300 text-xs border border-gray-200 dark:border-white/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Box */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0B2520] border border-[#077432]/15 dark:border-white/10 shadow-sm flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-14 h-14 rounded-2xl bg-[#077432] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
            {blog.author ? blog.author[0] : 'L'}
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#077432] dark:text-[#C6A15B] font-bold">
              Written by
            </span>
            <h4 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
              {blog.author || 'Living in the Light of Allah Editorial'}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Dedicated to disseminating authentic Islamic teachings, spiritual reflections, and beneficial knowledge according to the Quran and Sunnah.
            </p>
          </div>
        </div>
      </div>

      {/* Related Articles Section */}
      {relatedBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#077432] dark:text-[#C6A15B] font-bold">
                Continue Reading
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Related Reflections
              </h2>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#077432] dark:text-[#C6A15B] hover:gap-2 transition-all"
            >
              All Articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBlogs.map((item) => (
              <Link
                key={item._id}
                to={`/blog/${item.slug}`}
                className="group bg-white dark:bg-[#0B2520] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={
                      item.coverImage ||
                      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-[#077432] dark:text-[#C6A15B] uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#077432] dark:group-hover:text-[#C6A15B] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-white/5">
                    <span>{item.readTimeMinutes || 5} min read</span>
                    <span className="font-semibold text-[#077432] dark:text-[#C6A15B]">
                      Read &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
export default BlogPostPage;
