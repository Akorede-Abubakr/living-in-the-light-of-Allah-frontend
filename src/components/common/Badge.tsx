import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'dark' | 'emerald' | 'subtle' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'subtle',
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wide',
    md: 'text-xs px-2.5 py-1',
  };

  const variantClasses = {
    gold: 'bg-[#FAF6ED] text-[#8A6D37] border border-[#C6A15B]/50 font-medium',
    dark: 'bg-[#123C35] text-[#F8F5ED] border border-[#123C35] font-medium',
    emerald: 'bg-[#E1ECE7] text-[#123C35] border border-[#123C35]/25 font-semibold',
    subtle: 'bg-[#DDE8E1]/60 text-[#202522] border border-[#DDE8E1]',
    outline: 'bg-transparent text-[#123C35] border border-[#123C35]/30 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center uppercase tracking-wider rounded font-mono ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
