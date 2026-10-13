import React from 'react';
import { ShoppingBag, Lock, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '../common/Button';

interface PreviewInterruptionProps {
  bookTitle: string;
  author: string;
  coverImage: string;
  price: number;
  previewLimit: number;
  totalPages: number;
  onBuyClick: () => void;
  onReturnToPreview: () => void;
  theme: 'paper' | 'sepia' | 'dark';
}

export const PreviewInterruption: React.FC<PreviewInterruptionProps> = ({
  bookTitle,
  author,
  coverImage,
  price,
  previewLimit,
  totalPages,
  onBuyClick,
  onReturnToPreview,
  theme,
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="py-12 sm:py-16 px-4 animate-fadeIn">
      <div
        className={`max-w-xl mx-auto rounded-2xl border p-8 sm:p-10 shadow-xl text-center space-y-6 transition-colors ${
          isDark
            ? 'bg-[#181715] border-stone-800 text-stone-100 shadow-black/60'
            : theme === 'sepia'
            ? 'bg-[#F2E8D5] border-[#E0D3BC] text-[#382C1E]'
            : 'bg-white border-stone-200/90 text-ink-900 shadow-stone-200/50'
        }`}
      >
        {/* Lock / Bookmark badge */}
        <div className="w-14 h-14 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center mx-auto border border-brand-500/20">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-600 font-semibold">
            End of Free Sample
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
            You've reached the end of the free preview.
          </h3>
          <p
            className={`text-sm max-w-md mx-auto leading-relaxed ${
              isDark ? 'text-stone-400' : 'text-ink-600'
            }`}
          >
            Continue reading the complete manuscript of <strong>"{bookTitle}"</strong> by purchasing full lifetime access.
          </p>
        </div>

        {/* Mini Book Banner */}
        <div
          className={`flex items-center gap-4 p-4 rounded-xl text-left border ${
            isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-stone-50 border-stone-200/80'
          }`}
        >
          <img
            src={coverImage}
            alt={bookTitle}
            className="w-14 aspect-[2/3] object-cover rounded shadow-sm shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-serif font-bold text-sm truncate">{bookTitle}</h4>
            <p className="text-xs opacity-75">by {author}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-sm font-bold text-brand-600">
                ${price.toFixed(2)}
              </span>
              <span className="text-[10px] font-mono opacity-70">
                Complete book access
              </span>
            </div>
          </div>
        </div>

        {/* Benefits list */}
        <div className="text-xs space-y-2 text-left max-w-sm mx-auto opacity-85">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Instant unrestricted access to all chapters</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Automatic cloud progress sync across your devices</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Permanent ownership in your digital library</span>
          </div>
        </div>

        {/* Primary CTA & Back to preview button */}
        <div className="space-y-3 pt-2">
          <Button
            variant="editorial"
            size="lg"
            className="w-full py-3.5 text-base font-semibold shadow-lg hover:shadow-xl"
            onClick={onBuyClick}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Unlock Full Book for ${price.toFixed(2)}
          </Button>

          <button
            onClick={onReturnToPreview}
            className="inline-flex items-center gap-1 text-xs opacity-75 hover:opacity-100 transition-opacity underline underline-offset-4"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to free preview</span>
          </button>
        </div>
      </div>
    </div>
  );
};
