import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ChevronRight, Lock, Eye } from 'lucide-react';
import { Chapter } from '../../types';

interface TableOfContentsProps {
  bookId: string;
  chapters: Chapter[];
  previewLimit?: number;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  bookId,
  chapters,
  previewLimit = 5,
}) => {
  return (
    <div className="bg-white dark:bg-[#071A17] rounded-2xl border border-[#DDE8E1] dark:border-white/10 p-6 sm:p-8 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-white/10">
        <h3 className="font-serif text-xl font-bold text-[#202522] dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#077432] dark:text-[#34D399]" />
          <span>Table of Contents</span>
        </h3>
        <span className="text-xs font-sans text-stone-500 dark:text-stone-400">{chapters.length} Chapters</span>
      </div>

      <div className="divide-y divide-stone-100 dark:divide-white/10">
        {chapters.map((ch, idx) => (
          <div
            key={ch._id}
            className="py-3.5 flex items-center justify-between group hover:bg-stone-50 dark:hover:bg-white/5 px-3 rounded-lg transition-colors"
          >
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono text-[#077432] dark:text-[#34D399] font-semibold">
                Chapter {idx + 1}
              </span>
              <h4 className="font-serif text-sm font-bold text-[#202522] dark:text-white">
                {ch.title}
              </h4>
              {ch.description && (
                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">{ch.description}</p>
              )}
            </div>

            <Link
              to={`/read/${bookId}?chapter=${ch._id}`}
              className="inline-flex items-center text-xs font-sans font-semibold text-[#077432] dark:text-[#34D399] hover:text-[#0A8D3E] dark:hover:text-[#6EE7B7] gap-1 group-hover:translate-x-1 transition-transform"
            >
              <span>Read</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
