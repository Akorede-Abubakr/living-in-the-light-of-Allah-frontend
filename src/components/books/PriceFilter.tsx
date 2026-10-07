import React from 'react';

interface PriceFilterProps {
  priceRange: [number, number];
  onChange: (range: [number, number]) => void;
  maxPrice?: number;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  priceRange,
  onChange,
  maxPrice = 100,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-sans text-stone-600 dark:text-stone-300">
        <span>Max Price:</span>
        <span className="font-mono font-bold text-[#077432] dark:text-[#34D399]">${priceRange[1]}</span>
      </div>
      <input
        type="range"
        min={0}
        max={maxPrice}
        step={5}
        value={priceRange[1]}
        onChange={(e) => onChange([priceRange[0], Number(e.target.value)])}
        className="w-full accent-[#077432] cursor-pointer h-1.5 bg-stone-200 dark:bg-stone-700 rounded"
      />
    </div>
  );
};
