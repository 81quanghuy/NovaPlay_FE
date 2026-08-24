import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 font-display font-semibold rounded-pill transition-all duration-base ease-np-out disabled:opacity-60 disabled:cursor-not-allowed select-none';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white shadow-[0_0_24px_rgb(var(--np-primary-rgb)/0.4)] hover:bg-primary-hover active:bg-primary-press active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-hover',
  secondary:
    'bg-white/[0.08] border border-white/20 backdrop-blur-sm text-fg hover:bg-white/[0.14] active:scale-[0.97]',
  ghost: 'bg-transparent text-fg-2 hover:text-fg hover:bg-white/[0.06]',
  danger:
    'bg-danger text-white hover:bg-danger/90 active:bg-danger/80 shadow-[0_0_24px_rgb(var(--np-danger-rgb)/0.4)] active:scale-[0.97]',
  gold:
    'bg-grad-gold text-black font-extrabold shadow-[0_0_24px_rgb(var(--np-gold-rgb)/0.4)] hover:brightness-110 active:scale-[0.97]',
  outline:
    'bg-transparent border border-border text-fg-1 hover:border-primary/50 hover:text-primary hover:bg-primary/5 active:scale-[0.97]',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-12 px-8 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  );
}
