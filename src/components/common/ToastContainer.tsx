import React from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';
import { useToast, ToastItem } from '../../context/ToastContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <aside
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-24 right-4 sm:right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </aside>
  );
};

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: () => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  return (
    <div
      role="status"
      className="pointer-events-auto flex items-center gap-3 px-4 py-3.5 bg-white/95 dark:bg-[#071A17]/95 text-[#202522] dark:text-[#F8F5ED] rounded-xl border border-[#DDE8E1] dark:border-white/10 shadow-xl backdrop-blur-md animate-toast transition-all duration-300"
    >
      {/* Icon based on type */}
      {toast.type === 'success' && (
        <div className="w-8 h-8 rounded-full bg-[#077432] text-white flex items-center justify-center shrink-0 shadow-sm">
          <Check className="w-4 h-4 stroke-[3]" />
        </div>
      )}

      {toast.type === 'error' && (
        <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <AlertCircle className="w-4 h-4" />
        </div>
      )}

      {toast.type === 'info' && (
        <div className="w-8 h-8 rounded-full bg-[#C6A15B] text-white flex items-center justify-center shrink-0 shadow-sm">
          <Info className="w-4 h-4" />
        </div>
      )}

      {/* Message */}
      <div className="flex-1 min-w-0 pr-1">
        <p className="text-sm font-sans font-medium text-[#202522] dark:text-white leading-snug">
          {toast.message}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={onDismiss}
        className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 transition-colors shrink-0"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
