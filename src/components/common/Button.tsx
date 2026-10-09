import React, { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'editorial' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3.5 py-2 text-xs rounded-xl',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3.5 text-sm rounded-xl font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-[#077432] hover:bg-[#0A8D3E] text-white shadow-sm hover:shadow focus:ring-[#077432] border border-[#077432]',
    secondary:
      'bg-[#202522] hover:bg-[#2C302B] text-white shadow-sm hover:shadow focus:ring-[#202522] border border-[#202522]',
    editorial:
      'bg-[#077432] hover:bg-[#0A8D3E] text-white border border-[#077432] shadow-md hover:shadow-lg focus:ring-[#077432]',
    gold:
      'bg-[#C6A15B] hover:bg-[#B5914B] text-[#077432] font-semibold border border-[#C6A15B] shadow-sm hover:shadow focus:ring-[#C6A15B]',
    outline:
      'bg-transparent hover:bg-[#E8F6ED] dark:hover:bg-[#077432]/20 text-[#077432] dark:text-[#34D399] border border-[#077432]/40 dark:border-[#34D399]/40 hover:border-[#077432] dark:hover:border-[#34D399] focus:ring-[#077432]',
    ghost:
      'bg-transparent hover:bg-[#E8F6ED] dark:hover:bg-white/5 text-[#202522] dark:text-stone-200 hover:text-[#077432] dark:hover:text-[#34D399] focus:ring-[#E8F6ED]',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
