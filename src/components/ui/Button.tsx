import React from 'react';

/**
 * Reusable button component to unify styling across the app.
 * Variants: primary (gradient), subtle (glass), danger, outline, ghost.
 * Sizes: sm, md, lg.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'subtle' | 'danger' | 'outline' | 'ghost' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean; // for future <Link> or <a>
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-4 text-[12px] rounded-xl',
  md: 'h-11 px-6 text-[13px] rounded-2xl',
  lg: 'h-12 px-7 text-sm rounded-2xl'
};

const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');
const base = 'relative inline-flex items-center justify-center font-semibold tracking-wide whitespace-nowrap select-none focus:outline-none disabled:opacity-45 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden group';

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-pink-500 shadow-[0_4px_24px_-4px_rgba(59,130,246,0.4)] border border-white/10',
  subtle: 'text-white/90 bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-xl shadow-[0_2px_10px_-2px_rgba(255,255,255,0.15)]',
  danger: 'text-white bg-gradient-to-br from-rose-600 via-red-600 to-orange-500 hover:from-rose-500 hover:via-red-500 hover:to-amber-400 shadow-[0_6px_32px_-8px_rgba(244,63,94,0.65)] border border-white/10 after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_65%)] after:opacity-0 hover:after:opacity-30 after:transition-opacity',
  outline: 'text-white/90 bg-transparent border border-white/25 hover:border-white/50',
  ghost: 'text-white/70 hover:text-white bg-transparent hover:bg-white/10',
  whatsapp: 'text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-[0_4px_22px_-4px_rgba(16,185,129,0.55)] border border-white/10'
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading,
  leftIcon,
  rightIcon,
  className,
  ...rest
}) => {
  return (
    <button
  className={cx(base, sizeClasses[size], variants[variant], loading && 'pointer-events-none', className)}
      {...rest}
    >
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
      {loading && (
        <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 animate-pulse rounded-inherit" />
      )}
      <span className={cx('relative flex items-center gap-2', loading && 'opacity-70')}> 
        {leftIcon}
        {children}
        {rightIcon}
      </span>
    </button>
  );
};

export default Button;
