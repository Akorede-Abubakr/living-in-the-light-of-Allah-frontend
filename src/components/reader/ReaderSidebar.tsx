import React, { useState } from 'react';
import { X, BookOpen, Bookmark as BookmarkIcon, Lock, CheckCircle, ChevronRight } from 'lucide-react';
import { ChapterOutline, Bookmark } from '../../types';

interface ReaderSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: ChapterOutline[];
  bookmarks: Bookmark[];
  currentPage: number;
  previewLimit: number;
  isPurchased?: boolean;
  onJumpToPage: (page: number) => void;
  theme: 'paper' | 'sepia' | 'dark';
}

export const ReaderSidebar: React.FC<ReaderSidebarProps> = ({
  isOpen,
  onClose,
  chapters,
  bookmarks,
  currentPage,
  previewLimit,
  isPurchased = false,
  onJumpToPage,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<'toc' | 'bookmarks'>('toc');
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const bgClasses = {
    paper: 'bg-[#FAF8F5] text-ink-900 border-stone-300',
    sepia: 'bg-[#F6EFE2] text-[#382C1E] border-[#E8DFC8]',
    dark: 'bg-[#181715] text-stone-100 border-stone-800',
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div
        className={`relative w-80 sm:w-96 max-w-full h-full shadow-2xl flex flex-col border-r z-10 animate-slideRight ${bgClasses[theme]}`}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('toc')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'toc'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : isDark
                  ? 'text-stone-400 hover:bg-stone-800'
                  : 'text-ink-600 hover:bg-stone-200/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Chapters</span>
            </button>

            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'bookmarks'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : isDark
                  ? 'text-stone-400 hover:bg-stone-800'
                  : 'text-ink-600 hover:bg-stone-200/50'
              }`}
            >
              <BookmarkIcon className="w-3.5 h-3.5" />
              <span>Bookmarks ({bookmarks.length})</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-full ${
              isDark ? 'text-stone-400 hover:bg-stone-800' : 'text-ink-500 hover:bg-stone-200'
            }`}
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab === 'toc' ? (
            chapters.map((ch, idx) => {
              const startPage = ch.startPage || idx * 3 + 1;
              const isWithinPreview = isPurchased || startPage <= previewLimit;

              return (
                <button
                  key={ch.id || idx}
                  onClick={() => {
                    onJumpToPage(startPage);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                    currentPage >= (ch.startPage || 1) && currentPage <= (ch.endPage || 999)
                      ? 'border-brand-500 bg-brand-500/10 font-bold'
                      : isDark
                      ? 'border-stone-800/80 hover:bg-stone-800/50'
                      : 'border-stone-200/80 hover:bg-stone-100/60'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <p className="text-[11px] font-mono opacity-70">Chapter {idx + 1}</p>
                    <h5 className="font-serif text-xs sm:text-sm font-semibold truncate">
                      {ch.title}
                    </h5>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isWithinPreview ? (
                      <span className="text-[10px] font-mono text-emerald-600 font-medium">
                        p. {startPage}
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-stone-400" />
                    )}
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  </div>
                </button>
              );
            })
          ) : bookmarks.length === 0 ? (
            <div className="py-12 text-center text-xs opacity-60">
              <BookmarkIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No bookmarks saved for this book yet.
            </div>
          ) : (
            bookmarks.map((bkmk) => (
              <button
                key={bkmk._id}
                onClick={() => {
                  onJumpToPage(bkmk.pageNumber);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all space-y-1 ${
                  currentPage === bkmk.pageNumber
                    ? 'border-brand-500 bg-brand-500/10'
                    : isDark
                    ? 'border-stone-800/80 hover:bg-stone-800/50'
                    : 'border-stone-200/80 hover:bg-stone-100/60'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono opacity-80">
                  <span className="font-bold text-brand-600">Page {bkmk.pageNumber}</span>
                  <span>
                    {new Date(bkmk.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {bkmk.note ? (
                  <p className="text-xs line-clamp-2 italic">{bkmk.note}</p>
                ) : (
                  <p className="text-xs opacity-60">Bookmarked passage</p>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
