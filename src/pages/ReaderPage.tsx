import React, { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { readerApi, progressApi, bookmarksApi } from '../api';
import { ReaderHeader } from '../components/reader/ReaderHeader';
import { ReaderFooter } from '../components/reader/ReaderFooter';
import { ReaderSettingsModal, ReaderSettings } from '../components/reader/ReaderSettingsModal';
import { ReaderSidebar } from '../components/reader/ReaderSidebar';
import { PreviewInterruption } from '../components/reader/PreviewInterruption';
import { PurchaseModal } from '../components/details/PurchaseModal';
import { SEO } from '../components/common/SEO';
import { useAuth } from '../context/AuthContext';
import { BookAssistantPanel } from '../components/reader/BookAssistantPanel';
import { Modal } from '../components/common/Modal';

const OriginalDocumentPage = React.lazy(() => import('../components/reader/OriginalDocumentPage').then(module => ({ default: module.OriginalDocumentPage })));

export const ReaderPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Page state
  const initialPage = Math.max(1, Number(searchParams.get('page')) || 1);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  useEffect(() => {
    const requested = Number(searchParams.get('page'));
    setCurrentPage(Number.isInteger(requested) && requested > 0 ? requested : 1);
    window.scrollTo({ top: 0 });
  }, [bookId, searchParams]);

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
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Persist reader settings
  const handleUpdateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('brightmind_reader_settings', JSON.stringify(updated));
      return updated;
    });
  };

  // 1. Fetch Book Reader Metadata (chapters, previewLimit, bookmarks, saved progress)
  const { data: metaData, isLoading: isMetaLoading, error: metaError, refetch: refetchMeta } = useQuery({
    queryKey: ['readerMeta', bookId, user?.id],
    queryFn: () => readerApi.getMeta(bookId!),
    enabled: !!bookId,
  });

  const readerMeta = metaData?.data.data;
  const totalPages = readerMeta?.totalPages ?? 0;
  const previewLimit = readerMeta?.previewLimit ?? 0;
  const hasFullAccess = readerMeta?.hasFullAccess || false;

  useEffect(() => {
    if (readerMeta?.originalPagesAvailable && hasFullAccess) void import('../components/reader/OriginalDocumentPage');
  }, [readerMeta?.originalPagesAvailable, hasFullAccess]);

  useEffect(() => {
    if (!bookId || totalPages < 1) return;
    const lastAllowedPage = hasFullAccess ? totalPages : Math.min(previewLimit, totalPages);
    const adjacentPages = [currentPage - 1, currentPage + 1]
      .filter(pageNumber => pageNumber >= 1 && pageNumber <= lastAllowedPage);
    adjacentPages.forEach(pageNumber => {
      void queryClient.prefetchQuery({
        queryKey: ['readerPage', bookId, pageNumber, user?.id, hasFullAccess],
        queryFn: () => readerApi.getPage(bookId, pageNumber),
      });
    });
  }, [bookId, currentPage, totalPages, previewLimit, hasFullAccess, user?.id, queryClient]);

  // 2. Fetch Page Content with Access Control
  const { data: pageData, isLoading: isPageLoading, error: pageError, refetch: refetchPage } = useQuery({
    queryKey: ['readerPage', bookId, currentPage, user?.id, hasFullAccess],
    queryFn: () => readerApi.getPage(bookId!, currentPage),
    enabled: !!bookId && totalPages > 0,
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
      if (isAuthenticated && (hasFullAccess || clamped <= previewLimit)) {
        saveProgressMutation.mutate(clamped);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [totalPages, setSearchParams, isAuthenticated, hasFullAccess, previewLimit, saveProgressMutation]
  );

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const target = event.target;
    if (target instanceof Element && target.closest('button, a, input, textarea, select, [role="dialog"]')) {
      touchStart.current = null;
      return;
    }
    const touch = event.touches[0];
    if (touch) touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    const touch = event.changedTouches[0];
    if (!start || !touch) return;
    const horizontalDistance = touch.clientX - start.x;
    const verticalDistance = touch.clientY - start.y;
    if (Math.abs(horizontalDistance) < 55 || Math.abs(horizontalDistance) < Math.abs(verticalDistance) * 1.25) return;
    if (horizontalDistance < 0 && currentPage < totalPages) handlePageChange(currentPage + 1);
    else if (horizontalDistance > 0 && currentPage > 1) handlePageChange(currentPage - 1);
  };

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
        onOpenAssistant={() => setIsAssistantOpen(true)}
        theme={settings.theme}
      />

      {/* Main Reading Viewport */}
      {totalPages > 0 && !hasFullAccess && (
        <div className="px-4 py-3 flex flex-wrap items-center justify-center gap-4 border-b border-stone-300/30">
          <span>Free preview</span>
          <button className="rounded-lg bg-[#077432] text-white px-4 py-2" onClick={() => setIsPurchaseModalOpen(true)}>Buy full book</button>
        </div>
      )}
      {totalPages > 0 && (
        <nav aria-label="Reading page navigation">
          <button aria-label="Previous page" disabled={currentPage <= 1} onClick={() => handlePageChange(currentPage - 1)} className="hidden md:block fixed left-4 top-1/2 z-20 rounded-full bg-white text-stone-900 border border-stone-300 shadow p-3 disabled:opacity-30 disabled:cursor-not-allowed"><ChevronLeft /></button>
          <button aria-label="Next page" disabled={currentPage >= totalPages} onClick={() => handlePageChange(currentPage + 1)} className="hidden md:block fixed right-4 top-1/2 z-20 rounded-full bg-white text-stone-900 border border-stone-300 shadow p-3 disabled:opacity-30 disabled:cursor-not-allowed"><ChevronRight /></button>
        </nav>
      )}
      <main className="flex-1 flex flex-col justify-between px-1 py-2 pb-4 md:px-20 md:py-12 md:pb-24 touch-pan-y" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchCancel={() => { touchStart.current = null; }}>
        <div className={`mx-auto w-full max-md:!max-w-none ${widthClasses[settings.maxWidth]} transition-all duration-300`}>
          {isMetaLoading ? (
            <div className="space-y-4 animate-pulse py-12">
              <div className="h-6 bg-stone-300/40 rounded w-1/3 mb-6" />
              <div className="h-4 bg-stone-300/40 rounded w-full" />
              <div className="h-4 bg-stone-300/40 rounded w-full" />
              <div className="h-4 bg-stone-300/40 rounded w-4/5" />
              <div className="h-4 bg-stone-300/40 rounded w-full pt-4" />
              <div className="h-4 bg-stone-300/40 rounded w-3/4" />
            </div>
          ) : metaError ? (
            <div role="alert" className="py-12 text-center space-y-3">
              <p>Could not load this book. Please try again.</p>
              <button className="underline" onClick={() => refetchMeta()}>Retry</button>
            </div>
          ) : readerMeta && totalPages === 0 ? (
            <div role="status" className="py-12 text-center space-y-3">
              <h1 className="font-serif text-2xl">Reading pages are not available yet</h1>
              <p>The publisher needs to upload this book’s manuscript before it can be read.</p>
              <Link to={`/books/${bookId}`} className="inline-block underline">Back to book details</Link>
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
          ) : readerMeta?.originalPagesAvailable && hasFullAccess ? (
            <article aria-label={`Book page ${currentPage}`}>
              <Suspense fallback={<div role="status" className="min-h-[60vh] grid place-items-center bg-white text-stone-600">Preparing original book viewer…</div>}>
                <OriginalDocumentPage
                  key={`${bookId}-${readerMeta.documentVersion}-${user?.id}`}
                  bookId={bookId!}
                  pageNumber={currentPage}
                  documentVersion={readerMeta.documentVersion}
                  accessibleText={page?.content}
                  prefetchNext={currentPage < totalPages}
                />
              </Suspense>
            </article>
          ) : isPageLoading ? (
            <div className="space-y-4 animate-pulse py-12">
              <div className="h-6 bg-stone-300/40 rounded w-1/3 mb-6" />
              <div className="h-4 bg-stone-300/40 rounded w-full" />
              <div className="h-4 bg-stone-300/40 rounded w-full" />
              <div className="h-4 bg-stone-300/40 rounded w-4/5" />
              <div className="h-4 bg-stone-300/40 rounded w-full pt-4" />
            </div>
          ) : pageError ? (
            <div role="alert" className="py-12 text-center space-y-3">
              <p>Could not load this page.</p>
              <button className="underline" onClick={() => refetchPage()}>Retry</button>
              <button className="block mx-auto underline" onClick={() => handlePageChange(1)}>Go to first page</button>
            </div>
          ) : (
            <article aria-label={`Book page ${currentPage}`}>
              <div className="min-h-[65vh] bg-white text-stone-800 p-7 sm:p-10 md:p-14 border border-stone-200 shadow-lg">
                {page?.title && <h1 className="font-serif text-2xl font-semibold mb-6">{page.title}</h1>}
                <p className="whitespace-pre-wrap break-words leading-8 text-base sm:text-lg">{page?.content || 'This page has no readable text.'}</p>
              </div>
            </article>
          )}
        </div>
      </main>

      {bookId && isAssistantOpen && (
        <Modal isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} title="LightBridge AI" maxWidth="2xl">
          <BookAssistantPanel
            initiallyExpanded
            bookId={bookId}
            isAuthenticated={isAuthenticated}
            hasFullAccess={hasFullAccess}
            pageNumber={page?.pageNumber || currentPage}
            chapterTitle={page?.chapter?.title || ''}
            currentChapterKey={String(page?.chapter?._id || '')}
            theme={settings.theme}
            onGoToPage={(target) => { setIsAssistantOpen(false); handlePageChange(target); }}
          />
        </Modal>
      )}

      {/* Reader Bottom Navigation Bar */}
      {totalPages > 0 && <ReaderFooter
        currentPage={currentPage}
        totalPages={totalPages}
        hasNext={currentPage < totalPages}
        hasPrev={currentPage > 1}
        onNext={() => handlePageChange(currentPage + 1)}
        onPrev={() => handlePageChange(currentPage - 1)}
        onPageSelect={handlePageChange}
        theme={settings.theme}
        percentage={percentage}
      />}

      {/* Settings Modal */}
      <ReaderSettingsModal
        originalLayout
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
