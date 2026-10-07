import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white dark:bg-[#071A17] border border-[#DDE8E1] dark:border-white/10 rounded-xl pl-8 pr-8 py-2 text-xs font-sans font-medium text-[#202522] dark:text-stone-200 focus:outline-none focus:border-[#077432] cursor-pointer shadow-sm"
      >
        <option value="newest">Newest Releases</option>
        <option value="popular">Most Popular</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
      </select>
      <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
    </div>
  );
};
