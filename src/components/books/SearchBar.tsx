import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by title, author, or keywords...',
}) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-white/5 border border-[#DDE8E1] dark:border-white/10 rounded-xl text-sm font-sans text-[#202522] dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#077432] focus:ring-1 focus:ring-[#077432] transition-all shadow-sm"
      />
      <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 p-0.5 rounded-full"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
