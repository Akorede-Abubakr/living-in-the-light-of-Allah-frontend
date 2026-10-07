import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  max = 5,
  size = 'sm',
  showCount = false,
  count,
  interactive = false,
  onRatingChange,
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="flex items-center gap-1.5 select-none">
      <div className="flex items-center text-amber-500">
        {Array.from({ length: max }).map((_, index) => {
          const starNumber = index + 1;
          const isFilled = rating >= starNumber;
          const isHalf = !isFilled && rating >= starNumber - 0.5;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starNumber)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            >
              <Star
                className={`${iconSizes[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'text-stone-300 fill-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showCount && (
        <span className="text-xs text-ink-500 font-medium ml-0.5">
          {rating.toFixed(1)} {count !== undefined && <span className="text-ink-400">({count})</span>}
        </span>
      )}
    </div>
  );
};
