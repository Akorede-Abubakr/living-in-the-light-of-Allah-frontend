import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative bg-[#FFFFFF] dark:bg-[#071A17] w-full ${maxWidthClasses[maxWidth]} rounded-xl shadow-2xl border border-[#DDE8E1] dark:border-white/10 p-6 sm:p-8 z-10 animate-scaleUp`}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-[#077432] dark:hover:text-[#34D399] p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {title && (
          <div className="mb-6 pr-6">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#202522] dark:text-white">{title}</h3>
            {subtitle && <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{subtitle}</p>}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
};
