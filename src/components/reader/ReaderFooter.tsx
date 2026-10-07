import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReaderFooterProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  onPageSelect: (page: number) => void;
  theme: 'paper' | 'sepia' | 'dark';
  percentage: number;
}

export const ReaderFooter: React.FC<ReaderFooterProps> = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onNext,
  onPrev,
  onPageSelect,
  theme,
  percentage,
}) => {
  const isDark = theme === 'dark';

  const themeClasses = {
    paper: 'bg-[#FAF8F5]/90 border-stone-200/80 text-ink-900',
    sepia: 'bg-[#F6EFE2]/90 border-[#E8DFC8] text-[#382C1E]',
    dark: 'bg-[#121110]/95 border-stone-800 text-stone-100',
  };

  return (
    <footer
      className={`sticky bottom-0 z-30 px-4 py-3 backdrop-blur-md border-t transition-colors ${themeClasses[theme]}`}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        {/* Top Slider & Progress Indicator */}
        <div className="flex items-center gap-3 w-full">
          <input
            type="range"
            min={1}
            max={totalPages || 1}
            value={currentPage}
            onChange={(e) => onPageSelect(Number(e.target.value))}
            className="flex-1 accent-brand-500 cursor-pointer h-1 bg-stone-300/60 rounded"
          />
          <span className="font-mono text-[11px] shrink-0 font-medium opacity-80">
            {percentage}%
          </span>
        </div>

        {/* Bottom Bar: Prev / Page Count / Next */}
        <div className="flex items-center justify-between">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
              isDark ? 'hover:bg-stone-800' : 'hover:bg-stone-200/60'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <span className="font-mono text-xs font-semibold tracking-wider">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
              isDark ? 'hover:bg-stone-800' : 'hover:bg-stone-200/60'
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
