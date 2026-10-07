import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { readerApi, progressApi, bookmarksApi } from '../api';
import { ReaderHeader } from '../components/reader/ReaderHeader';
import { ReaderFooter } from '../components/reader/ReaderFooter';
import { ReaderSettingsModal, ReaderSettings } from '../components/reader/ReaderSettingsModal';
import { ReaderSidebar } from '../components/reader/ReaderSidebar';
import { PreviewInterruption } from '../components/reader/PreviewInterruption';
import { PurchaseModal } from '../components/details/PurchaseModal';
import { SEO } from '../components/common/SEO';
import { useAuth } from '../context/AuthContext';

export const ReaderPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Page state
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  // Reader Settings State
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    const saved = localStorage.getItem('brightmind_reader_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      theme: 'paper',
      fontSize: 18,
      fontFamily: 'serif',
      maxWidth: 'standard',
      lineHeight: 'normal',
    };
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  // Persist reader settings
  const handleUpdateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('brightmind_reader_settings', JSON.stringify(updated));
      return updated;
    });
  };

  // 1. Fetch Book Reader Metadata (chapters, previewLimit, bookmarks, saved progress)
  const { data: metaData, refetch: refetchMeta } = useQuery({
    queryKey: ['readerMeta', bookId],
    queryFn: () => readerApi.getMeta(bookId!),
    enabled: !!bookId,
  });

  const readerMeta = metaData?.data.data;
  const totalPages = readerMeta?.totalPages || 12;
  const previewLimit = readerMeta?.previewLimit || 5;
  const hasFullAccess = readerMeta?.hasFullAccess || false;

  // 2. Fetch Page Content with Access Control
  const { data: pageData, isLoading: isPageLoading, error: pageError, refetch: refetchPage } = useQuery({
    queryKey: ['readerPage', bookId, currentPage],
    queryFn: () => readerApi.getPage(bookId!, currentPage),
    enabled: !!bookId,
    retry: false,
  });

  const isPreviewExceeded = (pageError as any)?.response?.status === 403 ||
    (pageError as any)?.response?.data?.previewExceeded ||
    (!hasFullAccess && currentPage > previewLimit);

  // Progress Save Mutation
  const saveProgressMutation = useMutation({
    mutationFn: (page: number) =>
      progressApi.saveProgress({
        bookId: bookId!,
        pageNumber: page,
        totalPages,
      }),
  });

  // Bookmark Toggle Mutation
  const toggleBookmarkMutation = useMutation({
    mutationFn: () =>
      bookmarksApi.createBookmark({
        bookId: bookId!,
        pageNumber: currentPage,
      }),
    onSuccess: () => {
      refetchMeta();
      refetchPage();
    },
  });

  // Jump to specific page
  const handlePageChange = useCallback(
    (targetPage: number) => {
      const clamped = Math.max(1, Math.min(totalPages, targetPage));
      setCurrentPage(clamped);
      setSearchParams({ page: String(clamped) });

      // Save reading progress to backend if authenticated
      if (isAuthenticated) {
        saveProgressMutation.mutate(clamped);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [totalPages, setSearchParams, isAuthenticated, saveProgressMutation]
  );

  // Keyboard Navigation (Arrow Keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentPage < totalPages) handlePageChange(currentPage + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentPage > 1) handlePageChange(currentPage - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, handlePageChange]);

  const page = pageData?.data.data?.page;
  const isBookmarked = pageData?.data.data?.isBookmarked || false;
  const percentage = Math.min(100, Math.round((currentPage / (totalPages || 1)) * 100));

  // Width container class
  const widthClasses = {
    compact: 'max-w-xl',
    standard: 'max-w-2xl',
    wide: 'max-w-3xl',
  };

  const themeClasses = {
    paper: 'reader-theme-paper',
    sepia: 'reader-theme-sepia',
    dark: 'reader-theme-dark',
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${themeClasses[settings.theme]}`}>
      <SEO
        title={readerMeta?.book ? `Reading: ${readerMeta.book.title} (Page ${currentPage})` : 'Digital Reader'}
      />

      {/* Reader Top Toolbar */}
      <ReaderHeader
        bookTitle={readerMeta?.book.title || 'Digital Book'}
        bookId={bookId!}
        chapterTitle={page?.chapter?.title || (readerMeta?.chapters[0]?.title ?? '')}
        isBookmarked={isBookmarked}
        onToggleBookmark={() => toggleBookmarkMutation.mutate()}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        theme={settings.theme}
      />

      {/* Main Reading Viewport */}
      <main className="flex-1 flex flex-col justify-between py-8 sm:py-12 px-4 sm:px-6">
        <div className={`mx-auto w-full ${widthClasses[settings.maxWidth]} transition-all duration-300`}>
          {isPageLoading ? (
            <div className="space-y-4 animate-pulse py-12">
              <div className="h-6 bg-stone-300/40 rounded w-1/3 mb-6" />
              <div className="h-4 bg-stone-300/40 rounded w-full" />
              <div className="h-4 bg-stone-300/40 rounded w-full" />
              <div className="h-4 bg-stone-300/40 rounded w-4/5" />
              <div className="h-4 bg-stone-300/40 rounded w-full pt-4" />
              <div className="h-4 bg-stone-300/40 rounded w-3/4" />
            </div>
          ) : isPreviewExceeded ? (
            /* Beautiful Free Preview Interruption Card */
            <PreviewInterruption
              bookTitle={readerMeta?.book.title || 'Book'}
              author={readerMeta?.book.author || 'Author'}
              coverImage={readerMeta?.book.coverImage || ''}
              price={readerMeta?.book.price || 19.99}
              previewLimit={previewLimit}
              totalPages={totalPages}
              onBuyClick={() => setIsPurchaseModalOpen(true)}
              onReturnToPreview={() => handlePageChange(previewLimit)}
              theme={settings.theme}
            />
          ) : (
            /* Render Authentic Book Page Content */
            <article className="space-y-6 animate-fadeIn select-text">
              {/* Chapter & Page Subtitle */}
              <div className="pb-4 border-b border-stone-300/30 flex items-center justify-between text-xs font-mono opacity-75">
                <span>
                  {page?.chapter?.title || 'Chapter Reading'}
                </span>
                <span>Page {page?.pageNumber || currentPage}</span>
              </div>

              {/* Page Section Heading if any */}
              {page?.title && (
                <h2 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight mt-2 mb-6">
                  {page.title}
                </h2>
              )}

              {/* Page Content with customizable typography */}
              <div
                className={`leading-relaxed whitespace-pre-line tracking-normal ${
                  settings.fontFamily === 'serif' ? 'font-serif' : 'font-sans'
                }`}
                style={{
                  fontSize: `${settings.fontSize}px`,
                  lineHeight: settings.fontSize > 18 ? '1.8' : '1.7',
                }}
              >
                {page?.content}
              </div>

              {/* Word count & progress footer info */}
              <div className="pt-8 mt-12 border-t border-stone-300/30 flex items-center justify-between text-[11px] font-mono opacity-60">
                <span>~{page?.wordCount || 120} words</span>
                <span>
                  {currentPage <= previewLimit && !hasFullAccess ? (
                    <span className="text-amber-600 font-semibold">Free Sample Preview</span>
                  ) : (
                    <span>Full Access Edition</span>
                  )}
                </span>
              </div>
            </article>
          )}
        </div>
      </main>

      {/* Reader Bottom Navigation Bar */}
      <ReaderFooter
        currentPage={currentPage}
        totalPages={totalPages}
        hasNext={currentPage < totalPages}
        hasPrev={currentPage > 1}
        onNext={() => handlePageChange(currentPage + 1)}
        onPrev={() => handlePageChange(currentPage - 1)}
        onPageSelect={handlePageChange}
        theme={settings.theme}
        percentage={percentage}
      />

      {/* Settings Modal */}
      <ReaderSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Table of Contents & Bookmarks Sidebar Drawer */}
      <ReaderSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chapters={readerMeta?.chapters || []}
        bookmarks={readerMeta?.bookmarks || []}
        currentPage={currentPage}
        previewLimit={previewLimit}
        isPurchased={hasFullAccess}
        onJumpToPage={handlePageChange}
        theme={settings.theme}
      />

      {/* Checkout / Purchase Modal */}
      {readerMeta?.book && (
        <PurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          book={{
            _id: readerMeta.book.id,
            title: readerMeta.book.title,
            author: readerMeta.book.author,
            coverImage: readerMeta.book.coverImage,
            price: readerMeta.book.price,
            currency: readerMeta.book.currency,
          } as any}
          onPurchaseSuccess={() => {
            refetchMeta();
            refetchPage();
          }}
        />
      )}
    </div>
  );
};
