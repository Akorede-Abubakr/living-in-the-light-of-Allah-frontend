import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Menu, Bookmark, Sliders, Check } from 'lucide-react';

interface ReaderHeaderProps {
  bookTitle: string;
  bookId: string;
  chapterTitle?: string;
  isBookmarked?: boolean;
  onToggleBookmark: () => void;
  onOpenSettings: () => void;
  onOpenSidebar: () => void;
  theme: 'paper' | 'sepia' | 'dark';
}

export const ReaderHeader: React.FC<ReaderHeaderProps> = ({
  bookTitle,
  bookId,
  chapterTitle,
  isBookmarked = false,
  onToggleBookmark,
  onOpenSettings,
  onOpenSidebar,
  theme,
}) => {
  const isDark = theme === 'dark';

  const themeClasses = {
    paper: 'bg-[#FAF8F5]/90 border-stone-200/80 text-ink-900',
    sepia: 'bg-[#F6EFE2]/90 border-[#E8DFC8] text-[#382C1E]',
    dark: 'bg-[#121110]/95 border-stone-800 text-stone-100',
  };

  return (
    <header
      className={`sticky top-0 z-30 px-4 py-3 backdrop-blur-md border-b transition-colors ${themeClasses[theme]}`}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Back Link & Table of Contents Toggle */}
        <div className="flex items-center gap-2">
          <Link
            to={`/books/${bookId}`}
            className={`p-2 rounded-md transition-colors ${
              isDark ? 'hover:bg-stone-800 text-stone-300' : 'hover:bg-stone-200/60 text-ink-700'
            }`}
            title="Return to Book Details"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <button
            onClick={onOpenSidebar}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              isDark ? 'hover:bg-stone-800 text-stone-300' : 'hover:bg-stone-200/60 text-ink-700'
            }`}
            title="Table of Contents & Bookmarks"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline">Contents</span>
          </button>
        </div>

        {/* Center: Book and Chapter info */}
        <div className="text-center truncate px-2">
          <h2 className="text-xs sm:text-sm font-serif font-bold truncate">{bookTitle}</h2>
          {chapterTitle && (
            <p
              className={`text-[11px] truncate font-mono ${
                isDark ? 'text-stone-400' : 'text-ink-500'
              }`}
            >
              {chapterTitle}
            </p>
          )}
        </div>

        {/* Right: Bookmark & Reading Settings */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Bookmark Toggle */}
          <button
            onClick={onToggleBookmark}
            className={`p-2 rounded-md transition-all ${
              isBookmarked
                ? 'text-amber-500 bg-amber-500/10'
                : isDark
                ? 'hover:bg-stone-800 text-stone-400'
                : 'hover:bg-stone-200/60 text-stone-500'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this page'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>

          {/* Reader Preferences */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 p-2 rounded-md text-xs transition-colors ${
              isDark ? 'hover:bg-stone-800 text-stone-300' : 'hover:bg-stone-200/60 text-ink-700'
            }`}
            title="Reading Settings (Font, Theme, Spacing)"
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden md:inline font-mono text-[11px]">Aa</span>
          </button>
        </div>
      </div>
    </header>
  );
};
