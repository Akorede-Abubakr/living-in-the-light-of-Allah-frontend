import React from 'react';
import { Category } from '../../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory('all')}
        className={`px-4 py-2 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all ${
          selectedCategory === 'all'
            ? 'bg-[#077432] text-white shadow-sm'
            : 'bg-white dark:bg-white/5 text-stone-600 dark:text-stone-300 border border-[#DDE8E1] dark:border-white/10 hover:border-[#077432] dark:hover:border-[#34D399] hover:text-[#077432] dark:hover:text-[#34D399]'
        }`}
      >
        All Categories
      </button>

      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onSelectCategory(cat.slug)}
          className={`px-4 py-2 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all ${
            selectedCategory === cat.slug
              ? 'bg-[#077432] text-white shadow-sm'
              : 'bg-white dark:bg-white/5 text-stone-600 dark:text-stone-300 border border-[#DDE8E1] dark:border-white/10 hover:border-[#077432] dark:hover:border-[#34D399] hover:text-[#077432] dark:hover:text-[#34D399]'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};
